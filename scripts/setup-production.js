#!/usr/bin/env node

/**
 * Production Setup Script
 * Bu script production ortamını hazırlar
 */

const fs = require("fs")
const path = require("path")

console.log("🚀 Production ortamı hazırlanıyor...")

// Environment variables kontrolü
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "NEXTAUTH_SECRET",
  "SMTP_USER",
  "SMTP_PASS",
  "CLOUDINARY_CLOUD_NAME",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
]

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingVars.length > 0) {
  console.error("❌ Eksik environment variables:")
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`)
  })
  console.error("\n📝 Vercel Dashboard'dan bu değişkenleri ekleyin:")
  console.error("   https://vercel.com/dashboard/settings/environment-variables")
  process.exit(1)
}

// Package.json scripts kontrolü
const packageJsonPath = path.join(process.cwd(), "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

if (!packageJson.scripts.build) {
  packageJson.scripts.build = "next build"
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log("✅ Build script eklendi")
}

// Next.js config kontrolü
const nextConfigPath = path.join(process.cwd(), "next.config.mjs")
if (!fs.existsSync(nextConfigPath)) {
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongodb']
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com']
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

export default nextConfig
`
  fs.writeFileSync(nextConfigPath, nextConfig)
  console.log("✅ Next.js config oluşturuldu")
}

console.log("✅ Production ortamı hazır!")
console.log("\n📋 Sonraki adımlar:")
console.log("1. Vercel Dashboard'dan environment variables'ları ekle")
console.log("2. Domain ayarlarını yap")
console.log("3. SSL sertifikasını kontrol et")
console.log("4. Analytics entegrasyonunu aktifleştir")
