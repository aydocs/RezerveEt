import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    const pendingBusinesses = await DatabaseService.findMany(
      "businesses",
      { status: "pending" },
      { sort: { createdAt: -1 } },
    )

    return NextResponse.json({
      success: true,
      data: pendingBusinesses,
    })
  } catch (error) {
    console.error("Pending businesses API error:", error)
    return NextResponse.json({ success: false, error: "Veriler yüklenirken hata oluştu" }, { status: 500 })
  }
}
