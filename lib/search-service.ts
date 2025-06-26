import { connectToDatabase } from "./database"

export interface SearchFilters {
  query?: string
  category?: string
  city?: string
  district?: string
  rating?: number
  priceRange?: string[]
  amenities?: string[]
  location?: {
    lat: number
    lng: number
    radius: number
  }
  sortBy?: "rating" | "distance" | "price" | "reviews"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface SearchResult {
  businesses: any[]
  total: number
  page: number
  totalPages: number
  filters: {
    categories: { name: string; count: number }[]
    cities: { name: string; count: number }[]
    priceRanges: { range: string; count: number }[]
    amenities: { name: string; count: number }[]
  }
}

export class SearchService {
  static async searchBusinesses(filters: SearchFilters): Promise<SearchResult> {
    const db = await connectToDatabase()
    const page = filters.page || 1
    const limit = filters.limit || 12
    const skip = (page - 1) * limit

    // Ana sorgu oluştur
    const query = this.buildSearchQuery(filters)

    // Sıralama oluştur
    const sort = this.buildSortQuery(filters)

    // Arama yap
    const businesses = await db.collection("businesses").find(query).sort(sort).skip(skip).limit(limit).toArray()

    // Toplam sayı
    const total = await db.collection("businesses").countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Filtre seçenekleri
    const filterOptions = await this.getFilterOptions(db, filters)

    return {
      businesses,
      total,
      page,
      totalPages,
      filters: filterOptions,
    }
  }

  static async getPopularSearches(): Promise<string[]> {
    // En çok aranan terimler (cache'den veya analytics'ten)
    return ["restoran", "kuaför", "spor salonu", "kafe", "güzellik merkezi", "masaj", "diş kliniği", "veteriner"]
  }

  static async getSuggestions(query: string): Promise<string[]> {
    const db = await connectToDatabase()

    const suggestions = await db
      .collection("businesses")
      .find({
        $or: [
          { name: new RegExp(query, "i") },
          { category: new RegExp(query, "i") },
          { tags: { $in: [new RegExp(query, "i")] } },
        ],
        status: "approved",
        isActive: true,
      })
      .limit(5)
      .project({ name: 1, category: 1 })
      .toArray()

    return suggestions.map((s) => s.name)
  }

  private static buildSearchQuery(filters: SearchFilters) {
    const query: any = {
      status: "approved",
      isActive: true,
    }

    // Metin arama
    if (filters.query) {
      query.$or = [
        { name: new RegExp(filters.query, "i") },
        { description: new RegExp(filters.query, "i") },
        { category: new RegExp(filters.query, "i") },
        { tags: { $in: [new RegExp(filters.query, "i")] } },
        { amenities: { $in: [new RegExp(filters.query, "i")] } },
      ]
    }

    // Kategori filtresi
    if (filters.category && filters.category !== "all") {
      query.category = filters.category
    }

    // Şehir filtresi
    if (filters.city && filters.city !== "all") {
      query.city = filters.city
    }

    // İlçe filtresi
    if (filters.district) {
      query.district = filters.district
    }

    // Rating filtresi
    if (filters.rating) {
      query.rating = { $gte: filters.rating }
    }

    // Fiyat aralığı filtresi
    if (filters.priceRange && filters.priceRange.length > 0) {
      query.priceRange = { $in: filters.priceRange }
    }

    // Özellikler filtresi
    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $all: filters.amenities }
    }

    // Konum filtresi
    if (filters.location) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [filters.location.lng, filters.location.lat],
          },
          $maxDistance: filters.location.radius * 1000,
        },
      }
    }

    return query
  }

  private static buildSortQuery(filters: SearchFilters) {
    const sortOrder = filters.sortOrder === "asc" ? 1 : -1

    switch (filters.sortBy) {
      case "rating":
        return { rating: sortOrder, reviewCount: -1 }
      case "price":
        return { priceRange: sortOrder }
      case "reviews":
        return { reviewCount: sortOrder }
      case "distance":
        // Konum bazlı sıralama için $near kullanıldığında otomatik sıralanır
        return {}
      default:
        return { rating: -1, reviewCount: -1 }
    }
  }

  private static async getFilterOptions(db: any, currentFilters: SearchFilters) {
    // Mevcut filtreler hariç diğer seçenekleri getir
    const baseQuery = { status: "approved", isActive: true }

    // Kategoriler
    const categories = await db
      .collection("businesses")
      .aggregate([
        { $match: baseQuery },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    // Şehirler
    const cities = await db
      .collection("businesses")
      .aggregate([
        { $match: baseQuery },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ])
      .toArray()

    // Fiyat aralıkları
    const priceRanges = await db
      .collection("businesses")
      .aggregate([{ $match: baseQuery }, { $group: { _id: "$priceRange", count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
      .toArray()

    // Özellikler
    const amenities = await db
      .collection("businesses")
      .aggregate([
        { $match: baseQuery },
        { $unwind: "$amenities" },
        { $group: { _id: "$amenities", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ])
      .toArray()

    return {
      categories: categories.map((c) => ({ name: c._id, count: c.count })),
      cities: cities.map((c) => ({ name: c._id, count: c.count })),
      priceRanges: priceRanges.map((p) => ({ range: p._id, count: p.count })),
      amenities: amenities.map((a) => ({ name: a._id, count: a.count })),
    }
  }
}
