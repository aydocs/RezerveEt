import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"
import { sendBusinessRejectionEmail } from "@/lib/email-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    const { reason } = await request.json()
    if (!reason) {
      return NextResponse.json({ success: false, error: "Red sebebi gereklidir" }, { status: 400 })
    }

    const businessId = params.id

    // İşletmeyi bul
    const business = await DatabaseService.findOne("businesses", { _id: businessId })
    if (!business) {
      return NextResponse.json({ success: false, error: "İşletme bulunamadı" }, { status: 404 })
    }

    // İşletmeyi reddet
    await DatabaseService.updateOne(
      "businesses",
      { _id: businessId },
      {
        status: "rejected",
        isActive: false,
        rejectedAt: new Date(),
        rejectedBy: user.userId,
        rejectionReason: reason,
        updatedAt: new Date(),
      },
    )

    // Red e-postası gönder
    await sendBusinessRejectionEmail(business.email, business.name, reason)

    return NextResponse.json({
      success: true,
      message: "İşletme başvurusu reddedildi",
    })
  } catch (error) {
    console.error("Business rejection error:", error)
    return NextResponse.json({ success: false, error: "İşletme reddedilirken hata oluştu" }, { status: 500 })
  }
}
