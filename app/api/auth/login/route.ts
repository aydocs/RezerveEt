import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/database"

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret")

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "E-posta ve şifre gereklidir" }, { status: 400 })
    }

    // Admin girişi kontrolü
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = await new SignJWT({
        userId: 1,
        email: email,
        role: "admin",
        businessId: null,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(rememberMe ? "30d" : "1d")
        .sign(secret)

      const response = NextResponse.json({
        success: true,
        message: "Admin girişi başarılı",
        user: {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: email,
          role: "admin",
          businessId: null,
        },
      })

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      })

      return response
    }

    // Veritabanından kullanıcı ara
    const db = await connectToDatabase()
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "Geçersiz e-posta veya şifre" }, { status: 401 })
    }

    // Şifre kontrolü
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Geçersiz e-posta veya şifre" }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: "Hesabınız askıya alınmıştır" }, { status: 403 })
    }

    // JWT token oluştur
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId: user.businessId || null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(rememberMe ? "30d" : "1d")
      .sign(secret)

    const response = NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Giriş yapılırken bir hata oluştu" }, { status: 500 })
  }
}
