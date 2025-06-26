import { NextResponse } from "next/server"

// Mock data - production'da database'den gelecek
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
    email: "info@bellavista.com",
    website: "www.bellavista.com.tr",
    isOpen: true,
    isVerified: true,
    slug: "bella-vista-restaurant",
    priceRange: "₺₺₺",
    tags: ["Deniz Manzarası", "Romantik", "İtalyan"],
    amenities: ["WiFi", "Vale Park", "Kredi Kartı", "Rezervasyon"],
    workingHours: {
      monday: "12:00 - 24:00",
      tuesday: "12:00 - 24:00",
      wednesday: "12:00 - 24:00",
      thursday: "12:00 - 24:00",
      friday: "12:00 - 01:00",
      saturday: "12:00 - 01:00",
      sunday: "12:00 - 24:00",
    },
    services: [
      {
        id: 1,
        name: "Akşam Yemeği",
        description: "Premium İtalyan mutfağından özel menüler",
        duration: 120,
        price: 350,
      },
      {
        id: 2,
        name: "Öğle Yemeği",
        description: "İş yemeği için ideal seçenekler",
        duration: 90,
        price: 180,
      },
    ],
    status: "approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Daha fazla mock data...
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const category = searchParams.get("category")
    const city = searchParams.get("city")

    let filteredBusinesses = mockBusinesses

    if (featured === "true") {
      filteredBusinesses = filteredBusinesses.filter((business) => business.isVerified)
    }

    if (category) {
      filteredBusinesses = filteredBusinesses.filter((business) => business.category === category)
    }

    if (city) {
      filteredBusinesses = filteredBusinesses.filter((business) => business.city === city)
    }

    if (limit) {
      filteredBusinesses = filteredBusinesses.slice(0, Number.parseInt(limit))
    }

    return NextResponse.json({
      success: true,
      data: filteredBusinesses,
      total: filteredBusinesses.length,
    })
  } catch (error) {
    console.error("Businesses API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "İşletmeler yüklenirken hata oluştu",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation
    const requiredFields = ["name", "category", "description", "phone", "email", "city"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `${field} alanı zorunludur`,
          },
          { status: 400 },
        )
      }
    }

    // Mock business creation
    const newBusiness = {
      _id: Date.now().toString(),
      ...body,
      slug: body.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      status: "pending",
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: newBusiness,
      message: "İşletme başvurunuz alındı. İnceleme süreci başlatıldı.",
    })
  } catch (error) {
    console.error("Business creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "İşletme kaydı sırasında hata oluştu",
      },
      { status: 500 },
    )
  }
}
