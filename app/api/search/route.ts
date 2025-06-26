import { NextResponse } from "next/server"

// Mock data for businesses - production'da database'den gelecek
const mockBusinesses = [
  {
    _id: "1",
    name: "Bella Vista Restaurant",
    category: "Restoran",
    description: "Boğaz manzaralı eşsiz lezzetler sunan premium İtalyan restoranı",
    rating: 4.8,
    reviewCount: 324,
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Kuruçeşme Cad. No:12, Beşiktaş, İstanbul",
    city: "İstanbul",
    phone: "+90 212 555 0123",
    isOpen: true,
    slug: "bella-vista-restaurant",
    priceRange: "₺₺₺",
    tags: ["Deniz Manzarası", "Romantik", "İtalyan"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Style Hair Studio",
    category: "Kuaför",
    description: "Modern teknikler ve uzman ekiple saç bakım hizmetleri",
    rating: 4.9,
    reviewCount: 189,
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Nişantaşı Mah. Teşvikiye Cad. No:45, Şişli, İstanbul",
    city: "İstanbul",
    phone: "+90 212 555 0456",
    isOpen: true,
    slug: "style-hair-studio",
    priceRange: "₺₺",
    tags: ["Unisex", "Modern", "Uzman Ekip"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "FitZone Gym",
    category: "Spor Salonu",
    description: "24/7 açık modern fitness merkezi",
    rating: 4.7,
    reviewCount: 256,
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Mecidiyeköy Mah. Büyükdere Cad. No:78, Şişli, İstanbul",
    city: "İstanbul",
    phone: "+90 212 555 0789",
    isOpen: false,
    slug: "fitzone-gym",
    priceRange: "₺₺",
    tags: ["24/7", "Modern Ekipman", "Kişisel Antrenör"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Aroma Coffee House",
    category: "Kafe",
    description: "Özel kahve çeşitleri ve ev yapımı tatlılar",
    rating: 4.6,
    reviewCount: 98,
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Galata Mah. İstiklal Cad. No:123, Beyoğlu, İstanbul",
    city: "İstanbul",
    phone: "+90 212 555 0321",
    isOpen: true,
    slug: "aroma-coffee-house",
    priceRange: "₺",
    tags: ["Özel Kahve", "WiFi", "Çalışma Alanı"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Ankara Steakhouse",
    category: "Restoran",
    description: "Premium et yemekleri ve şarap seçenekleri",
    rating: 4.5,
    reviewCount: 167,
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Çankaya Mah. Tunalı Hilmi Cad. No:56, Çankaya, Ankara",
    city: "Ankara",
    phone: "+90 312 555 0654",
    isOpen: true,
    slug: "ankara-steakhouse",
    priceRange: "₺₺₺",
    tags: ["Et Yemekleri", "Şarap", "Lüks"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    name: "İzmir Kuaför Salonu",
    category: "Kuaför",
    description: "Geleneksel ve modern saç tasarım hizmetleri",
    rating: 4.4,
    reviewCount: 134,
    images: ["/placeholder.svg?height=300&width=400"],
    location: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:89, Konak, İzmir",
    city: "İzmir",
    phone: "+90 232 555 0987",
    isOpen: true,
    slug: "izmir-kuafor-salonu",
    priceRange: "₺₺",
    tags: ["Geleneksel", "Modern", "Saç Tasarım"],
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const categories = searchParams.get("categories") || ""
    const city = searchParams.get("city") || ""
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "1000")
    const sortBy = searchParams.get("sortBy") || "rating"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    let filteredBusinesses = mockBusinesses

    // Text search
    if (query) {
      filteredBusinesses = filteredBusinesses.filter(
        (business) =>
          business.name.toLowerCase().includes(query.toLowerCase()) ||
          business.description.toLowerCase().includes(query.toLowerCase()) ||
          business.category.toLowerCase().includes(query.toLowerCase()) ||
          business.location.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Category filter
    if (categories && categories !== "all") {
      const categoryList = categories.split(",").filter(Boolean)
      if (categoryList.length > 0) {
        filteredBusinesses = filteredBusinesses.filter((business) => categoryList.includes(business.category))
      }
    }

    // City filter
    if (city && city !== "all") {
      filteredBusinesses = filteredBusinesses.filter((business) => business.city === city)
    }

    // Price range filter (simplified)
    filteredBusinesses = filteredBusinesses.filter((business) => {
      const priceLevel = business.priceRange.length
      return priceLevel >= minPrice / 250 && priceLevel <= maxPrice / 250
    })

    // Sorting
    switch (sortBy) {
      case "rating":
        filteredBusinesses.sort((a, b) => b.rating - a.rating)
        break
      case "reviews":
        filteredBusinesses.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "price-low":
        filteredBusinesses.sort((a, b) => a.priceRange.length - b.priceRange.length)
        break
      case "price-high":
        filteredBusinesses.sort((a, b) => b.priceRange.length - a.priceRange.length)
        break
      case "newest":
        filteredBusinesses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        break
    }

    // Pagination
    const total = filteredBusinesses.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        businesses: paginatedBusinesses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Arama sırasında hata oluştu",
      },
      { status: 500 },
    )
  }
}
