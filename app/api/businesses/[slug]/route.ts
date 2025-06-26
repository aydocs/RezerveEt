import { type NextRequest, NextResponse } from "next/server"

// Mock data - gerçek uygulamada veritabanından gelecek
const mockBusinesses = [
  {
    id: 1,
    name: "Bella Vista Restaurant",
    slug: "bella-vista-restaurant",
    category: "Restoran",
    rating: 4.8,
    reviewCount: 124,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    location: "Kadıköy Sahil, İstanbul",
    isOpen: true,
    description:
      "Deniz manzaralı muhteşem İtalyan mutfağı deneyimi. Taze deniz ürünleri ve ev yapımı makarnalarımızla unutulmaz bir akşam yemeği için bizi ziyaret edin.",
    phone: "+90 216 123 4567",
    email: "info@bellavista.com",
    website: "www.bellavista.com",
    address: "Kadıköy Sahil Yolu No:123, Kadıköy/İstanbul",
    priceRange: "₺₺₺",
    tags: ["Deniz Manzarası", "Romantik", "İtalyan", "Canlı Müzik"],
    services: [
      {
        id: 1,
        name: "Akşam Yemeği",
        duration: 120,
        price: 250,
        description: "2 kişilik romantik akşam yemeği menüsü",
        isActive: true,
      },
      {
        id: 2,
        name: "Öğle Yemeği",
        duration: 90,
        price: 150,
        description: "İş yemeği için ideal öğle menüsü",
        isActive: true,
      },
      {
        id: 3,
        name: "Brunch",
        duration: 90,
        price: 120,
        description: "Hafta sonu özel brunch menüsü",
        isActive: true,
      },
    ],
    workingHours: {
      monday: "11:00 - 23:00",
      tuesday: "11:00 - 23:00",
      wednesday: "11:00 - 23:00",
      thursday: "11:00 - 23:00",
      friday: "11:00 - 24:00",
      saturday: "11:00 - 24:00",
      sunday: "12:00 - 22:00",
    },
    reviews: [
      {
        id: 1,
        user: "Ayşe K.",
        rating: 5,
        comment: "Harika bir deneyimdi! Yemekler çok lezzetliydi ve servis mükemmeldi.",
        date: "2024-01-15",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        user: "Mehmet S.",
        rating: 4,
        comment: "Manzara gerçekten güzel, fiyatlar biraz yüksek ama kalite var.",
        date: "2024-01-10",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    amenities: ["WiFi", "Otopark", "Klima", "Açık Hava", "Canlı Müzik", "Çocuk Menüsü"],
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // İşletmeyi slug ile bul
    const business = mockBusinesses.find((b) => b.slug === slug)

    if (!business) {
      return NextResponse.json({ success: false, error: "İşletme bulunamadı" }, { status: 404 })
    }

    // Görüntülenme sayısını artır (gerçek uygulamada veritabanında yapılacak)
    // await incrementViewCount(business.id)

    return NextResponse.json({
      success: true,
      data: business,
    })
  } catch (error) {
    console.error("Business Detail API Error:", error)
    return NextResponse.json(
      { success: false, error: "İşletme bilgileri yüklenirken bir hata oluştu" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const body = await request.json()

    // İşletmeyi bul
    const businessIndex = mockBusinesses.findIndex((b) => b.slug === slug)

    if (businessIndex === -1) {
      return NextResponse.json({ success: false, error: "İşletme bulunamadı" }, { status: 404 })
    }

    // İşletme bilgilerini güncelle (gerçek uygulamada auth kontrolü yapılacak)
    const updatedBusiness = {
      ...mockBusinesses[businessIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    mockBusinesses[businessIndex] = updatedBusiness

    return NextResponse.json({
      success: true,
      message: "İşletme bilgileri başarıyla güncellendi",
      data: updatedBusiness,
    })
  } catch (error) {
    console.error("Business Update API Error:", error)
    return NextResponse.json({ success: false, error: "İşletme güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // İşletmeyi bul
    const businessIndex = mockBusinesses.findIndex((b) => b.slug === slug)

    if (businessIndex === -1) {
      return NextResponse.json({ success: false, error: "İşletme bulunamadı" }, { status: 404 })
    }

    // İşletmeyi sil (gerçek uygulamada soft delete yapılacak)
    mockBusinesses.splice(businessIndex, 1)

    return NextResponse.json({
      success: true,
      message: "İşletme başarıyla silindi",
    })
  } catch (error) {
    console.error("Business Delete API Error:", error)
    return NextResponse.json({ success: false, error: "İşletme silinirken bir hata oluştu" }, { status: 500 })
  }
}
