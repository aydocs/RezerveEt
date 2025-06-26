import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"
import { sendBusinessApprovalEmail } from "@/lib/email-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    const { note } = await request.json()
    const businessId = params.id

    // İşletmeyi bul
    const business = await DatabaseService.findOne("businesses", { _id: businessId })
    if (!business) {
      return NextResponse.json({ success: false, error: "İşletme bulunamadı" }, { status: 404 })
    }

    // İşletmeyi onayla
    await DatabaseService.updateOne(
      "businesses",
      { _id: businessId },
      {
        status: "approved",
        isActive: true,
        isVerified: true,
        approvedAt: new Date(),
        approvedBy: user.userId,
        approvalNote: note || "",
        updatedAt: new Date(),
      },
    )

    // Onay e-postası gönder
    await sendBusinessApprovalEmail(business.email, business.name)

    return NextResponse.json({
      success: true,
      message: "İşletme başarıyla onaylandı",
    })
  } catch (error) {
    console.error("Business approval error:", error)
    return NextResponse.json({ success: false, error: "İşletme onaylanırken hata oluştu" }, { status: 500 })
  }
}
