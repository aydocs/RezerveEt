import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    const { reason } = await request.json()
    const userId = params.id

    await DatabaseService.updateOne(
      "users",
      { _id: userId },
      {
        isActive: false,
        suspendedAt: new Date(),
        suspendedBy: user.userId,
        suspensionReason: reason || "Admin tarafından askıya alındı",
        updatedAt: new Date(),
      },
    )

    return NextResponse.json({
      success: true,
      message: "Kullanıcı askıya alındı",
    })
  } catch (error) {
    console.error("User suspension error:", error)
    return NextResponse.json({ success: false, error: "Kullanıcı askıya alınırken hata oluştu" }, { status: 500 })
  }
}
