import 'dotenv/config';

export default {
  expo: {
    userInterfaceStyle: 'automatic',
    name: 'Blended Mates',
    slug: 'blended-mates',
    scheme: 'com.blended-mates.app',
    privacy: 'unlisted',
    platforms: ['ios', 'android'],
    version: '0.0.15',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#FFFFFF',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      paymentUrl: process.env.PAYMENT_URL,
      mailUrl: process.env.MAIL_URL,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      delSub: process.env.DEL_SUB,
      forgetUrl: process.env.FORGET_URL,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      fbAppId: process.env.FB_APP_ID,
    },
    android: {
      package: 'com.blended',
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your friends.',
        },
      ],
    ],
  },
};
