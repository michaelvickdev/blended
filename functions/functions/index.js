const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const stripe = require('stripe')(
  'sk_test_51LT4F4BgPqjmJlMVouCyiVJ2D8DryA6qLZmjhNhdHePhiRkWrDrZ2OIgRMztT23H36LuaMCWvob9jWISzqA3IA0300sMqjNBXG'
);
admin.initializeApp();

/**
 * Here we're using Gmail to send
 */
let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'michaelvick.dev@gmail.com',
    pass: 'lrbbujyrtvlxgkvb',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const username = req.query.username;
    const email = req.query.email;
    const password = req.query.password;

    const mailOptions = {
      from: 'Blended Mates <support@blendedmates.com>',
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
