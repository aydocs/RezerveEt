import { MongoClient, type Db, type Collection, type Filter, type UpdateFilter } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("❌ MONGODB_URI environment variable is not set.");
if (!dbName) throw new Error("❌ MONGODB_DB environment variable is not set.");

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) return { client, db };

  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  db = client.db(dbName);

  console.log("✅ MongoDB bağlantısı kuruldu.");
  return { client, db };
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("🔌 MongoDB bağlantısı kapatıldı.");
  }
}

export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

export class DatabaseService {
  static async findOne<T>(collectionName: string, filter: Filter<T>): Promise<T | null> {
    const collection = await getCollection<T>(collectionName);
    return collection.findOne(filter);
  }

  static async findMany<T>(
    collectionName: string,
    filter: Filter<T> = {},
    options: Parameters<Collection<T>["find"]>[1] = {}
  ): Promise<T[]> {
    const collection = await getCollection<T>(collectionName);
    return collection.find(filter, options).toArray();
  }

  static async insertOne<T>(collectionName: string, document: T) {
    const collection = await getCollection<T>(collectionName);
    return collection.insertOne(document);
  }

  static async updateOne<T>(
    collectionName: string,
    filter: Filter<T>,
    update: UpdateFilter<T> | Partial<T>
  ) {
    const collection = await getCollection<T>(collectionName);
    const updateDoc = "$set" in update ? update : { $set: update };
    return collection.updateOne(filter, updateDoc);
  }

  static async deleteOne<T>(collectionName: string, filter: Filter<T>) {
    const collection = await getCollection<T>(collectionName);
    return collection.deleteOne(filter);
  }

  static async count<T>(collectionName: string, filter: Filter<T> = {}) {
    const collection = await getCollection<T>(collectionName);
    return collection.countDocuments(filter);
  }
}

// Veritabanı indexleri oluşturma fonksiyonu
export async function createIndexes() {
  try {
    const { db } = await connectToDatabase();

    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ phone: 1 });
    await db.collection("users").createIndex({ role: 1 });

    await db.collection("businesses").createIndex({ slug: 1 }, { unique: true });
    await db.collection("businesses").createIndex({ category: 1 });
    await db.collection("businesses").createIndex({ city: 1 });
    await db.collection("businesses").createIndex({ location: "2dsphere" });
    await db.collection("businesses").createIndex({ rating: -1 });
    await db.collection("businesses").createIndex({ isActive: 1 });

    await db.collection("reservations").createIndex({ businessId: 1 });
    await db.collection("reservations").createIndex({ userId: 1 });
    await db.collection("reservations").createIndex({ date: 1, time: 1 });
    await db.collection("reservations").createIndex({ status: 1 });
    await db.collection("reservations").createIndex({ createdAt: -1 });

    await db.collection("reviews").createIndex({ businessId: 1 });
    await db.collection("reviews").createIndex({ userId: 1 });
    await db.collection("reviews").createIndex({ rating: 1 });
    await db.collection("reviews").createIndex({ createdAt: -1 });

    console.log("✅ Veritabanı indeksleri başarıyla oluşturuldu.");
  } catch (err) {
    console.error("❌ İndeks oluşturma hatası:", err);
  }
}

/**
 * İşletmeleri filtreleyerek getirir (arama, kategori, şehir, lokasyon, değerlendirme, fiyat aralığı, pagination)
 */
export async function findBusinesses(filters: {
  category?: string;
  city?: string;
  search?: string;
  location?: { lat: number; lng: number; radius: number }; // radius metre cinsinden
  rating?: number;
  priceRange?: string[]; // örn: ["$", "$$"]
  limit?: number;
  offset?: number;
}): Promise<any[]> {
  const { db } = await connectToDatabase();
  const collection = db.collection("businesses");

  const query: any = { isActive: true };

  if (filters.category) query.category = filters.category;
  if (filters.city) query.city = filters.city;

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  if (filters.rating) {
    query.rating = { $gte: filters.rating };
  }

  if (filters.priceRange && filters.priceRange.length > 0) {
    query.priceRange = { $in: filters.priceRange };
  }

  if (filters.location) {
    query.location = {
      $geoWithin: {
        $centerSphere: [
          [filters.location.lng, filters.location.lat],
          filters.location.radius / 6378137, // radius / dünya yarıçapı (metre to radian)
        ],
      },
    };
  }

  const cursor = collection.find(query);

  if (filters.offset) cursor.skip(filters.offset);
  if (filters.limit) cursor.limit(filters.limit);

  return cursor.toArray();
}

/**
 * Yeni rezervasyon oluşturur
 */
export async function createReservation(reservationData: Partial<any>) {
  const collection = (await getCollection("reservations"));
  const now = new Date();

  const reservation = {
    ...reservationData,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(reservation);
  return result.insertedId;
}

/**
 * İşletmenin puan ortalamasını rezervasyonlar ve yorumlar bazında günceller
 */
export async function updateBusinessRating(businessId: string) {
  const { db } = await connectToDatabase();

  // Ortalama puan hesaplamak için reviews koleksiyonundan hesaplama yapalım
  const reviewsCollection = db.collection("reviews");

  const aggregation = await reviewsCollection.aggregate([
    { $match: { businessId } },
    {
      $group: {
        _id: "$businessId",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const avgRating = aggregation.length > 0 ? aggregation[0].avgRating : 0;

  // İşletme koleksiyonunda güncelle
  const businessesCollection = db.collection("businesses");
  await businessesCollection.updateOne(
    { _id: businessId },
    { $set: { rating: avgRating } }
  );

  return avgRating;
}
