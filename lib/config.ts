export const config = {
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "RezerveEt",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://web-rezerve-et-com-clone-lilac.vercel.app",
    description: "Türkiye'nin en gelişmiş rezervasyon platformu",
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || "",
    name: process.env.MONGODB_DB_NAME || "rezerveet",
  },

  // Authentication Configuration
  auth: {
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "rezerveet-secret-key-2024",
    url:
      process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://web-rezerve-et-com-clone-lilac.vercel.app",
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    },
    from: process.env.SMTP_FROM || "noreply@rezerveet.com",
  },

  // SMS Configuration
  sms: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || "",
      authToken: process.env.TWILIO_AUTH_TOKEN || "",
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
    },
  },

  // Payment Configuration
  payment: {
    iyzico: {
      apiKey: process.env.IYZICO_API_KEY || "",
      secretKey: process.env.IYZICO_SECRET_KEY || "",
      baseUrl: process.env.NODE_ENV === "production" ? "https://api.iyzipay.com" : "https://sandbox-api.iyzipay.com",
    },
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      secretKey: process.env.STRIPE_SECRET_KEY || "",
    },
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  },

  // File Upload Configuration
  upload: {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
      apiKey: process.env.CLOUDINARY_API_KEY || "",
      apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  // Google Services Configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    analyticsId: process.env.GOOGLE_ANALYTICS_ID || "",
  },

  // Admin Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@rezerveet.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },

  // Rate Limiting
  rateLimit: {
    max: Number.parseInt(process.env.RATE_LIMIT_MAX || "100"),
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
  },

  // Security
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || "rezerveet-encryption-key-2024",
    corsOrigins: [
      "https://web-rezerve-et-com-clone-lilac.vercel.app",
      "https://rezerveet.com",
      "https://www.rezerveet.com",
    ],
  },

  // Features
  features: {
    enableRegistration: true,
    enableBusinessApplications: true,
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    enablePushNotifications: false,
    maintenanceMode: false,
  },

  // Social Media
  social: {
    facebookPixelId: process.env.FACEBOOK_PIXEL_ID || "",
    twitterHandle: "@rezerveet",
    facebookPage: "rezerveet",
    instagramHandle: "rezerveet",
  },

  // Backup Configuration
  backup: {
    schedule: process.env.BACKUP_SCHEDULE || "0 2 * * *", // Daily at 2 AM
    retentionDays: Number.parseInt(process.env.BACKUP_RETENTION_DAYS || "30"),
  },
}

export default config
