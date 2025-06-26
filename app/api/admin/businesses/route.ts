import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"
import { BusinessModel } from "@/lib/models/business"

export async function GET(request: NextRequest) {
  try {
    // Admin yetkisi kontrolü
    const user = await AuthService.getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const filters: any = {}
    if (status !== "all") {
      filters.status = status
    }

    const businesses = await BusinessModel.findMany(filters, {
      limit,
      skip: (page - 1) * limit,
      sort: { createdAt: -1 },
    })

    return NextResponse.json({
      success: true,
      data: businesses,
    })
  } catch (error) {
    console.error("Admin businesses API error:", error)
    return NextResponse.json({ success: false, error: "İşletmeler yüklenirken hata oluştu" }, { status: 500 })
  }
}
