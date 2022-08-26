const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { Expo } = require('expo-server-sdk');
const cors = require('cors')({ origin: true });
const stripe = require('stripe')(
  'sk_test_51LT4F4BgPqjmJlMVouCyiVJ2D8DryA6qLZmjhNhdHePhiRkWrDrZ2OIgRMztT23H36LuaMCWvob9jWISzqA3IA0300sMqjNBXG'
);
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
admin.initializeApp();

const db = admin.firestore();

const sendPushNotification = async ({ uid, message }) => {
  const messages = [];
  const data = await db.doc('users/' + uid).get();
  if (!data.exists || typeof data.data()?.expoPushToken !== 'string') {
    console.log(`No token found for ${uid}.`);
    return;
  }

  const pushToken = data.data()?.expoPushToken;

  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  messages.push({
    to: pushToken,
    sound: 'default',
    title: message.title,
    body: message.body,
  });

  try {
    await expo.sendPushNotificationsAsync(messages);
  } catch (error) {
    console.error(error);
  }
};

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secureConnection: false,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'welcome@blendedmates.com',
        pass: 'WealthG#22',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const username = req.query.username;
    const email = req.query.email;
    const password = req.query.password;

    const mailOptions = {
      from: 'Blended Mates <welcome@blendedmates.com>',
      to: email,
      subject: 'Please update your Personal Profile', // email subject
      html: `
            <h2>Hello ${username}</h2>
            <br />
            <p>Welcome to a Unique Next Generation Single Parent App - BlendedMates.</p>
            <br />
            <p>Now you must log in with below credentials</p>
            <p>Username: ${email}</p>
            <p>Password: ${password} (change later for security reasons)</p>
            <br />
            <p>Thanks for Joining a unique New Generation ONE IN ALL APP</p>

            <br />
            <br />
            <br />
            <p>Blended Mates Support Team</p>
            <a href="www.blendedmates.com">www.blendedmates.com</a>
            <p>Source: App</p>
            `,
    };

    // returning result
    return transporter.sendMail(mailOptions, (erro, info) => {
      if (erro) {
        return res.send(erro.toString());
      }
      console.log('Message sent: ', info);
      return res.send('Sent');
    });
  });
});

exports.payWithStripe = functions.https.onRequest(async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.email,
      name: req.body.name,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: req.body.priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    res.send(error);
  }
});

exports.cancelSubscription = functions.https.onRequest(async (req, res) => {
  try {
    const subscription = await stripe.subscriptions.del(req.body.subscriptionId);
    res.send(subscription);
  } catch (error) {
    res.send(error);
  }
});

exports.forgotPassword = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secureConnection: false,
        secure: false,
        requireTLS: true,
        auth: {
          user: 'support@blendedmates.com',
          pass: 'WealthG#22',
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const email = req.query.email;

      const userData = await admin.auth().getUserByEmail(email);
      const uid = userData.uid;
      const password = Math.floor(100000 + Math.random() * 900000).toString();
      admin.auth().updateUser(uid, { password: password });

      const mailOptions = {
        from: 'Blended Mates <support@blendedmates.com>',
        to: email,
        subject: 'Request for updating credentials', // email subject
        html: `
            <h2>Hello,</h2>
            <br />
            <p>You have requested for a password change. Please use below credentials to login</p>
            <br />
            <p>Username: ${email}</p>
            <p>Password: ${password} (change later for security reasons)</p>

            <br />
            <br />
            <br />
            <p>Blended Mates Support Team</p>
            <a href="www.blendedmates.com">www.blendedmates.com</a>
            <p>Source: App</p>
            `,
      };

      // returning result
      return transporter.sendMail(mailOptions, (erro, info) => {
        if (erro) {
          return res.send({ status: 'error', message: erro.toString() });
        }
        console.log('Message sent: ', info);
        return res.send({ status: 'success', message: 'Message Sent' });
      });
    } catch (error) {
      res.send({ status: 'error', message: error.message });
    }
  });
});

exports.userNotification = functions.firestore
  .document('users/{userId}')
  .onWrite((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    data.friends.forEach((friend) => {
      if (!previousData.friends.includes(friend)) {
        if (previousData.requests.includes(friend)) {
          db.doc('users/' + data.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                let text = doc.data().username + ' accepted you friend request.';
                db.doc('users/' + friend).update({
                  notifications: admin.firestore.FieldValue.arrayUnion(text),
                });
                sendPushNotification(friend, { title: 'Request Accepted', body: text });
              }
            });
        }
      }
    });

    data.requests.forEach((request) => {
      if (!previousData.requests.includes(request)) {
        db.doc('users/' + request)
          .get()
          .then((doc) => {
            if (doc.exists) {
              let text = doc.data().username + ' sent you a friend request';
              db.doc('users/' + data.uid).update({
                notifications: admin.firestore.FieldValue.arrayUnion(text),
              });
              sendPushNotification(data.uid, { title: 'Friend Request', body: text });
            }
          });
      }
    });

    previousData.requests.forEach((uid) => {
      if (!data.requests.includes(uid)) {
        if (!data.friends.includes(uid)) {
          db.doc('users/' + uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                db.doc('users/' + data.uid).update({
                  notifications: admin.firestore.FieldValue.arrayRemove(
                    doc.data().username + ' sent you a friend request'
                  ),
                });
              }
            });
        }
      }
    });
  });

exports.feedsNotification = functions.firestore
  .document('feeds/{feedId}')
  .onWrite((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();

    data.likes.forEach((user) => {
      if (user != data.uid && !previousData.likes.includes(user)) {
        db.doc('users/' + user)
          .get()
          .then((doc) => {
            if (doc.exists) {
              let text = doc.data().username + ` liked your feed: '${data.title}'`;
              db.doc('users/' + data.uid).update({
                notifications: admin.firestore.FieldValue.arrayUnion(text),
              });
              sendPushNotification(data.uid, { title: 'Like on Feed', body: text });
            }
          });
      }
    });

    previousData.likes.forEach((user) => {
      if (user != data.uid && !data.likes.includes(user)) {
        db.doc('users/' + user)
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.doc('users/' + data.uid).update({
                notifications: admin.firestore.FieldValue.arrayRemove(
                  doc.data().username + ` liked your feed: '${data.title}'`
                ),
              });
            }
          });
      }
    });

    data.comments.forEach((comment) => {
      if (
        previousData.comments.some(
          (oldComment) => JSON.stringify(oldComment) !== JSON.stringify(comment)
        )
      ) {
        console.log('filtered...');
        if (comment.sentBy != data.uid) {
          functions.logger.log('New Comment: ', comment);
          db.doc('users/' + comment.sentBy)
            .get()
            .then((doc) => {
              if (doc.exists) {
                functions.logger.log('New Comment: ', comment);
                let text =
                  doc.data().username +
                  ` commented '${comment.text}' on your feed: '${data.title}'`;
                db.doc('users/' + data.uid).update({
                  notifications: admin.firestore.FieldValue.arrayUnion(text),
                });

                sendPushNotification(data.uid, { title: 'Comment on Feed', body: text });
              }
            });
        }
      }
    });
  });
