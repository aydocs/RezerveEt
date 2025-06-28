import { ObjectId } from "mongodb";
import { connectToDatabase } from "../database";

export interface Service {
  _id?: ObjectId;
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  category?: string;
  maxCapacity?: number;
  requirements?: string[];
}

export interface Business {
  _id?: ObjectId;
  name: string;
  slug: string;
  category: string;
  description: string;
  ownerId: ObjectId;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  images: string[];
  rating: number;
  reviewCount: number;
  totalReservations: number;
  isOpen: boolean;
  isVerified: boolean;
  status: "pending" | "approved" | "rejected" | "suspended";
  priceRange: "₺" | "₺₺" | "₺₺₺" | "₺₺₺₺";
  tags: string[];
  amenities: string[];
  website?: string;
  taxNumber?: string;
  services: Service[];
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  settings: {
    autoApprove: boolean;
    requirePrepayment: boolean;
    cancellationPolicy: string;
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export class BusinessModel {
  static async create(
    businessData: Omit<
      Business,
      | "_id"
      | "createdAt"
      | "updatedAt"
      | "slug"
      | "rating"
      | "reviewCount"
      | "totalReservations"
    >
  ): Promise<ObjectId> {
    const { db } = await connectToDatabase();

    const business: Omit<Business, "_id"> = {
      ...businessData,
      slug: this.generateSlug(businessData.name),
      rating: 0,
      reviewCount: 0,
      totalReservations: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("businesses").insertOne(business);
    return result.insertedId;
  }

  static async findById(id: string | ObjectId): Promise<Business | null> {
    const { db } = await connectToDatabase();
    const doc = await db
      .collection("businesses")
      .findOne({ _id: new ObjectId(id) });
    return doc as Business | null;
  }

  static async findBySlug(slug: string): Promise<Business | null> {
    const { db } = await connectToDatabase();
    const doc = await db.collection("businesses").findOne({ slug });
    return doc as Business | null;
  }

  static async search(filters: {
    category?: string;
    city?: string;
    search?: string;
    location?: { lat: number; lng: number; radius: number };
    rating?: number;
    priceRange?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ businesses: Business[]; total: number }> {
    const { db } = await connectToDatabase();
    const query: any = { status: "approved", isOpen: true };

    if (filters.category && filters.category !== "all") {
      query.category = filters.category;
    }

    if (filters.city && filters.city !== "all") {
      query.city = new RegExp(filters.city, "i");
    }

    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        { description: new RegExp(filters.search, "i") },
        { tags: { $in: [new RegExp(filters.search, "i")] } },
      ];
    }

    if (filters.location) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [filters.location.lng, filters.location.lat],
          },
          $maxDistance: filters.location.radius * 1000,
        },
      };
    }

    if (filters.rating) {
      query.rating = { $gte: filters.rating };
    }

    if (filters.priceRange && filters.priceRange.length > 0) {
      query.priceRange = { $in: filters.priceRange };
    }

    const total = await db.collection("businesses").countDocuments(query);
    const businesses = await db
      .collection("businesses")
      .find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(filters.limit || 10)
      .skip(filters.offset || 0)
      .toArray();

    return { businesses: businesses as Business[], total };
  }

  static async updateRating(businessId: string | ObjectId): Promise<void> {
    const { db } = await connectToDatabase();

    const pipeline = [
      { $match: { businessId: new ObjectId(businessId), isVisible: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ];

    const result = await db.collection("reviews").aggregate(pipeline).toArray();

    if (result.length > 0) {
      const { avgRating, count } = result[0];
      await db.collection("businesses").updateOne(
        { _id: new ObjectId(businessId) },
        {
          $set: {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: count,
            updatedAt: new Date(),
          },
        }
      );
    }
  }

  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
}
