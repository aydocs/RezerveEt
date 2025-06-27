import { MongoClient, type Db, type Collection } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

if (!dbName) {
  throw new Error("MONGODB_DB environment variable is not set");
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) {
    return { client, db };
  }

  // MongoClient oluşturuluyor. TLS ayarı burada belirtilmiyor, URI zaten handle eder.
  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();

  db = client.db(dbName);

  return { client, db };
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

// Collection alma helper fonksiyonu
export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

// Database servis sınıfı
export class DatabaseService {
  static async findOne<T>(collectionName: string, filter: any): Promise<T | null> {
    const collection = await getCollection<T>(collectionName);
    return collection.findOne(filter);
  }

  static async findMany<T>(collectionName: string, filter: any = {}, options: any = {}): Promise<T[]> {
    const collection = await getCollection<T>(collectionName);
    return collection.find(filter, options).toArray();
  }

  static async insertOne<T>(collectionName: string, document: T): Promise<any> {
    const collection = await getCollection<T>(collectionName);
    return collection.insertOne(document as any);
  }

  static async updateOne<T>(collectionName: string, filter: any, update: any): Promise<any> {
    const collection = await getCollection(collectionName);
    return collection.updateOne(filter, { $set: update });
  }

  static async deleteOne(collectionName: string, filter: any): Promise<any> {
    const collection = await getCollection(collectionName);
    return collection.deleteOne(filter);
  }

  static async count(collectionName: string, filter: any = {}): Promise<number> {
    const collection = await getCollection(collectionName);
    return collection.countDocuments(filter);
  }
}

// İndeks oluşturma fonksiyonu
export async function createIndexes() {
  try {
    const { db } = await connectToDatabase();

    // Users
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ phone: 1 });
    await db.collection("users").createIndex({ role: 1 });

    // Businesses
    await db.collection("businesses").createIndex({ slug: 1 }, { unique: true });
    await db.collection("businesses").createIndex({ category: 1 });
    await db.collection("businesses").createIndex({ city: 1 });
    await db.collection("businesses").createIndex({ location: "2dsphere" });
    await db.collection("businesses").createIndex({ rating: -1 });
    await db.collection("businesses").createIndex({ isActive: 1 });

    // Reservations
    await db.collection("reservations").createIndex({ businessId: 1 });
    await db.collection("reservations").createIndex({ userId: 1 });
    await db.collection("reservations").createIndex({ date: 1, time: 1 });
    await db.collection("reservations").createIndex({ status: 1 });
    await db.collection("reservations").createIndex({ createdAt: -1 });

    // Reviews
    await db.collection("reviews").createIndex({ businessId: 1 });
    await db.collection("reviews").createIndex({ userId: 1 });
    await db.collection("reviews").createIndex({ rating: 1 });
    await db.collection("reviews").createIndex({ createdAt: -1 });

    console.log("Database indexes created successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}

// Placeholder fonksiyonlar
export async function findBusinesses(filters: {
  category?: string;
  city?: string;
  search?: string;
  location?: { lat: number; lng: number; radius: number };
  rating?: number;
  priceRange?: string[];
  limit?: number;
  offset?: number;
}): Promise<any[]> {
  return [];
}

export async function createReservation(reservationData: Partial<any>) {
  // TODO: Rezervasyon oluşturma ve çakışma kontrolü
}

export async function updateBusinessRating(businessId: string) {
  // TODO: İşletmenin ortalama puanını güncelle
}
