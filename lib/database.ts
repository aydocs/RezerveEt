import { MongoClient, type Db, type Collection } from "mongodb"

// MongoDB bağlantısı ve model tanımları
// Gerçek uygulamada MongoDB Atlas kullanılacak

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: "user" | "business" | "admin"
  isActive: boolean
  emailVerified: boolean
  phoneVerified: boolean
  avatar?: string
  preferences?: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    language: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Business {
  _id: string
  name: string
  slug: string
  category: string
  description: string
  ownerId: string
  ownerName: string
  email: string
  phone: string
  address: string
  city: string
  district: string
  postalCode?: string
  location: {
    type: "Point"
    coordinates: [number, number] // [longitude, latitude]
  }
  images: string[]
  rating: number
  reviewCount: number
  totalReservations: number
  isOpen: boolean
  isVerified: boolean
  status: "pending" | "approved" | "rejected" | "suspended"
  priceRange: "₺" | "₺₺" | "₺₺₺" | "₺₺₺₺"
  tags: string[]
  amenities: string[]
  website?: string
  taxNumber?: string
  services: Service[]
  workingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  settings: {
    autoApprove: boolean
    requirePrepayment: boolean
    cancellationPolicy: string
    notifications: {
      email: boolean
      sms: boolean
    }
  }
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  _id: string
  businessId: string
  name: string
  description: string
  duration: number // dakika
  price: number
  isActive: boolean
  category?: string
  maxCapacity?: number
  requirements?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Reservation {
  _id: string
  businessId: string
  businessName: string
  businessSlug: string
  serviceId: string
  serviceName: string
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  guests: number
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
  price: number
  notes?: string
  paymentStatus: "not_required" | "pending" | "paid" | "refunded"
  paymentMethod?: "credit_card" | "debit_card" | "cash" | "bank_transfer"
  paymentId?: string
  confirmationCode: string
  cancellationReason?: string
  reminderSent: boolean
  reviewId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id: string
  businessId: string
  reservationId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number // 1-5
  comment: string
  images?: string[]
  response?: {
    text: string
    date: Date
  }
  isVerified: boolean
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  isActive: boolean
  businessCount: number
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface City {
  _id: string
  name: string
  slug: string
  country: string
  isActive: boolean
  businessCount: number
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface SystemSettings {
  _id: string
  key: string
  value: any
  description: string
  type: "string" | "number" | "boolean" | "object" | "array"
  isPublic: boolean
  updatedAt: Date
}

import config from "./config"

let client: MongoClient
let db: Db

// MongoDB bağlantı fonksiyonları
export async function connectToDatabase() {
  try {
    if (!config.database.uri) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    if (!client) {
      client = new MongoClient(config.database.uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      await client.connect()
    }

    if (!db) {
      db = client.db(config.database.name)
    }

    return { client, db }
  } catch (error) {
    console.error("Database connection error:", error)
    throw error
  }
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close()
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    const { db } = await connectToDatabase()
    await db.admin().ping()
    return { status: "healthy", timestamp: new Date().toISOString() }
  } catch (error) {
    return { status: "unhealthy", error: error.message, timestamp: new Date().toISOString() }
  }
}

export { db, client }

export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase()
  return db.collection<T>(collectionName)
}

// Database helper functions
export class DatabaseService {
  static async findOne<T>(collectionName: string, filter: any): Promise<T | null> {
    const collection = await getCollection<T>(collectionName)
    return collection.findOne(filter)
  }

  static async findMany<T>(collectionName: string, filter: any = {}, options: any = {}): Promise<T[]> {
    const collection = await getCollection<T>(collectionName)
    return collection.find(filter, options).toArray()
  }

  static async insertOne<T>(collectionName: string, document: T): Promise<any> {
    const collection = await getCollection<T>(collectionName)
    return collection.insertOne(document as any)
  }

  static async updateOne<T>(collectionName: string, filter: any, update: any): Promise<any> {
    const collection = await getCollection<T>(collectionName)
    return collection.updateOne(filter, { $set: update })
  }

  static async deleteOne(collectionName: string, filter: any): Promise<any> {
    const collection = await getCollection(collectionName)
    return collection.deleteOne(filter)
  }

  static async count(collectionName: string, filter: any = {}): Promise<number> {
    const collection = await getCollection(collectionName)
    return collection.countDocuments(filter)
  }
}

async function createIndexes() {
  try {
    // Users collection indexes
    const { db } = await connectToDatabase()
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ phone: 1 })
    await db.collection("users").createIndex({ role: 1 })

    // Businesses collection indexes
    await db.collection("businesses").createIndex({ slug: 1 }, { unique: true })
    await db.collection("businesses").createIndex({ category: 1 })
    await db.collection("businesses").createIndex({ city: 1 })
    await db.collection("businesses").createIndex({ location: "2dsphere" })
    await db.collection("businesses").createIndex({ rating: -1 })
    await db.collection("businesses").createIndex({ isActive: 1 })

    // Reservations collection indexes
    await db.collection("reservations").createIndex({ businessId: 1 })
    await db.collection("reservations").createIndex({ userId: 1 })
    await db.collection("reservations").createIndex({ date: 1, time: 1 })
    await db.collection("reservations").createIndex({ status: 1 })
    await db.collection("reservations").createIndex({ createdAt: -1 })

    // Reviews collection indexes
    await db.collection("reviews").createIndex({ businessId: 1 })
    await db.collection("reviews").createIndex({ userId: 1 })
    await db.collection("reviews").createIndex({ rating: 1 })
    await db.collection("reviews").createIndex({ createdAt: -1 })

    console.log("Database indexes created successfully")
  } catch (error) {
    console.error("Error creating indexes:", error)
  }
}

// Örnek sorgu fonksiyonları
export async function findBusinesses(filters: {
  category?: string
  city?: string
  search?: string
  location?: { lat: number; lng: number; radius: number }
  rating?: number
  priceRange?: string[]
  limit?: number
  offset?: number
}) {
  // MongoDB aggregation pipeline ile gelişmiş arama
}

export async function createReservation(reservationData: Partial<Reservation>) {
  // Rezervasyon oluştur ve çakışma kontrolü yap
}

export async function updateBusinessRating(businessId: string) {
  // İşletmenin ortalama puanını güncelle
}
