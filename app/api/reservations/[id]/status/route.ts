import { type NextRequest, NextResponse } from "next/server"
import { ReservationModel } from "@/lib/models/reservation"
import { AuthService } from "@/lib/auth-service"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Giriş gerekli" }, { status: 401 })
    }

    const { status, reason } = await request.json()
    const reservationId = params.id

    const reservation = await ReservationModel.findById(reservationId)
    if (!reservation) {
      return NextResponse.json({ success: false, error: "Rezervasyon bulunamadı" }, { status: 404 })
    }

    // Yetki kontrolü
    if (user.role === "business" && reservation.businessId.toString() !== user.businessId) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    if (user.role === "user" && reservation.userId?.toString() !== user.id) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    // Durum güncelle
    const updated = await ReservationModel.updateStatus(reservationId, status, reason)

    if (!updated) {
      return NextResponse.json({ success: false, error: "Güncelleme başarısız" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Rezervasyon durumu güncellendi",
    })
  } catch (error) {
    console.error("Reservation status update error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Durum güncellenirken hata oluştu",
      },
      { status: 500 },
    )
  }
}
