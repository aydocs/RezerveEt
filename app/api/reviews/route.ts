import { type NextRequest, NextResponse } from "next/server"

// Mock review data - gerçek uygulamada veritabanından gelecek
const mockReviews = [
  {
    id: 1,
    businessId: 1,
    businessName: "Bella Vista Restaurant",
    reservationId: 2,
    userId: 1,
    userName: "Ayşe K.",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Harika bir deneyimdi! Yemekler çok lezzetliydi ve servis mükemmeldi.",
    images: [],
    response: null,
    isVerified: true,
    isVisible: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    businessId: 1,
    businessName: "Bella Vista Restaurant",
    reservationId: 3,
    userId: 2,
    userName: "Mehmet S.",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Manzara gerçekten güzel, fiyatlar biraz yüksek ama kalite var.",
    images: [],
    response: {
      text: "Yorumunuz için teşekkür ederiz! Sizleri tekrar ağırlamaktan mutluluk duyarız.",
      date: "2024-01-11T00:00:00Z",
    },
    isVerified: true,
    isVisible: true,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-11T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredReviews = [...mockReviews]

    // İşletme filtresi
    if (businessId) {
      filteredReviews = filteredReviews.filter((review) => review.businessId === Number.parseInt(businessId))
    }

    // Kullanıcı filtresi
    if (userId) {
      filteredReviews = filteredReviews.filter((review) => review.userId === Number.parseInt(userId))
    }

    // Sadece görünür yorumları getir
    filteredReviews = filteredReviews.filter((review) => review.isVisible)

    // Tarihe göre sırala (en yeni önce)
    filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const total = filteredReviews.length
    const reviews = filteredReviews.slice(offset, offset + limit)

    // Ortalama puan hesapla
    const averageRating =
      filteredReviews.length > 0
        ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length
        : 0

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
        statistics: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: total,
          ratingDistribution: {
            5: filteredReviews.filter((r) => r.rating === 5).length,
            4: filteredReviews.filter((r) => r.rating === 4).length,
            3: filteredReviews.filter((r) => r.rating === 3).length,
            2: filteredReviews.filter((r) => r.rating === 2).length,
            1: filteredReviews.filter((r) => r.rating === 1).length,
          },
        },
      },
    })
  } catch (error) {
    console.error("Reviews API Error:", error)
    return NextResponse.json({ success: false, error: "Yorumlar yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basit validasyon
    const requiredFields = ["businessId", "reservationId", "userId", "userName", "rating", "comment"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Eksik alanlar",
          missingFields,
        },
        { status: 400 },
      )
    }

    // Rating validation
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ success: false, error: "Puan 1-5 arasında olmalıdır" }, { status: 400 })
    }

    // Check if user already reviewed this reservation
    const existingReview = mockReviews.find((r) => r.reservationId === body.reservationId && r.userId === body.userId)

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "Bu rezervasyon için zaten yorum yapmışsınız" },
        { status: 409 },
      )
    }

    // Create new review
    const newReview = {
      id: mockReviews.length + 1,
      businessId: body.businessId,
      businessName: body.businessName || "İşletme",
      reservationId: body.reservationId,
      userId: body.userId,
      userName: body.userName,
      userAvatar: body.userAvatar || "/placeholder.svg?height=40&width=40",
      rating: body.rating,
      comment: body.comment,
      images: body.images || [],
      response: null,
      isVerified: true, // Rezervasyon üzerinden geldiği için doğrulanmış
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Mock olarak listeye ekle
    mockReviews.push(newReview)

    // İşletmenin ortalama puanını güncelle (gerçek uygulamada)
    // await updateBusinessRating(body.businessId)

    return NextResponse.json(
      {
        success: true,
        message: "Yorumunuz başarıyla kaydedildi",
        data: {
          reviewId: newReview.id,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Review Creation Error:", error)
    return NextResponse.json({ success: false, error: "Yorum kaydedilirken bir hata oluştu" }, { status: 500 })
  }
}
