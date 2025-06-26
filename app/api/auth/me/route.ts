import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkilendirme gerekli" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
        firstName: user.firstName || "Kullanıcı",
        lastName: user.lastName || "",
        phone: user.phone || "",
        businessId: user.businessId,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ success: false, error: "Kimlik doğrulama hatası" }, { status: 500 })
  }
}
