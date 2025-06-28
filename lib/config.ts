export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "RezerveEt",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://rezerve-et.vercel.app",
    description: "Türkiye'nin en gelişmiş rezervasyon platformu",
  },

  database: {
    uri: process.env.MONGODB_URI || "mongodb+srv://rezerveet:rezerveet@rezerveet.atensst.mongodb.net/",
    name: process.env.MONGODB_DB || "rezerveet",
  },

  auth: {
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "rezerveet-secret-key-2024",
    url: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://rezerve-et.vercel.app",
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 gün (saniye)
  },

  email: {
    smtp: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // 587 portu için false (STARTTLS)
      auth: {
        user: process.env.SMTP_USER || "patakanefe@gmail.com",
        pass: process.env.SMTP_PASS || "",
      },
    },
    from: process.env.SMTP_FROM || "patakanefe@gmail.com",
  },

  sms: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || "",
      authToken: process.env.TWILIO_AUTH_TOKEN || "",
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
    },
  },

  payment: {
    iyzico: {
      apiKey: process.env.IYZICO_API_KEY || "sandbox-your-api-key",
      secretKey: process.env.IYZICO_SECRET_KEY || "sandbox-your-secret-key",
      baseUrl:
        process.env.NODE_ENV === "production"
          ? "https://api.iyzipay.com"
          : "https://sandbox-api.iyzipay.com",
    },
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      secretKey: process.env.STRIPE_SECRET_KEY || "",
    },
  },

  redis: {
    url: process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  },

  upload: {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "ds7rlzkxr",
      apiKey: process.env.CLOUDINARY_API_KEY || "168495488645658",
      apiSecret: process.env.CLOUDINARY_API_SECRET || "XJ5RPNZwU9SRwkYOj9RBUGM_elU",
    },
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "your-google-oauth-client-id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your-google-oauth-client-secret",
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "your-google-maps-api-key",
    analyticsId: process.env.GOOGLE_ANALYTICS_ID || "G-XXXXXXXXXX",
  },

  admin: {
    email: process.env.ADMIN_EMAIL || "admin@rezerveet.com",
    password: process.env.ADMIN_PASSWORD || "admin123456",
  },

  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 dakika ms
  },

  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || "hjbGT673gdhHJS8sjsad8912ksadLL32",
    corsOrigins: [
      "https://rezerveet.vercel.app",
      "https://rezerveet.com",
      "https://www.rezerveet.com",
      "https://rezerve-et.vercel.app",
    ],
  },

  features: {
    enableRegistration: process.env.FEATURE_ENABLE_REGISTRATION !== "false",
    enableBusinessApplications: process.env.FEATURE_ENABLE_BUSINESS_APPLICATIONS !== "false",
    enableEmailNotifications: process.env.FEATURE_ENABLE_EMAIL_NOTIFICATIONS !== "false",
    enableSmsNotifications: process.env.FEATURE_ENABLE_SMS_NOTIFICATIONS !== "false",
    enablePushNotifications: process.env.FEATURE_ENABLE_PUSH_NOTIFICATIONS === "true",
    maintenanceMode: process.env.FEATURE_MAINTENANCE_MODE === "true",
  },

  social: {
    facebookPixelId: process.env.FACEBOOK_PIXEL_ID || "123456789",
    twitterHandle: "@rezerveet",
    facebookPage: "rezerveet",
    instagramHandle: "rezerveet",
  },

  backup: {
    schedule: process.env.BACKUP_SCHEDULE || "0 2 * * *", // Her gün 02:00
    retentionDays: Number(process.env.BACKUP_RETENTION_DAYS) || 30,
  },

  notification: {
    pushPublicKey: process.env.PUSH_PUBLIC_KEY || "BEbx9NQue1Tt0GPtkUF_MPzJVFtRh_rHmswFNeXCykZpcwlGS7QuxJ8ZSelFi-xuz2xSpGBMPwAsZw0ahbIqNkI",
    pushPrivateKey: process.env.PUSH_PRIVATE_KEY || "jaw3VX2p5pli3VbN48sNg_hlTX47C6EFmFAXyBE3nMw",
    pushNotificationKey: process.env.PUSH_NOTIFICATION_KEY || "your-push-notification-key",
    firebaseServerKey: process.env.FIREBASE_SERVER_KEY || "your-firebase-server-key",
  }
};

export default config;
