import { type NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/database";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET) throw new Error("JWT_SECRET env değişkeni tanımlı değil!");
if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL env değişkeni tanımlı değil!");
if (!ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD env değişkeni tanımlı değil!");

const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    const { email: rawEmail, password, rememberMe = false } = await request.json();

    if (!rawEmail || !password) {
      return NextResponse.json(
        { success: false, error: "E-posta ve şifre gereklidir." },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase();

    // --- Admin Girişi ---
    if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const token = await new SignJWT({
        userId: "1",
        email,
        role: "admin",
        businessId: null,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(rememberMe ? "30d" : "1d")
        .sign(secret);

      const response = NextResponse.json({
        success: true,
        message: "Admin girişi başarılı.",
        user: {
          id: "1",
          firstName: "Admin",
          lastName: "User",
          email,
          role: "admin",
          businessId: null,
        },
      });

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // saniye
        path: "/",
      });

      return response;
    }

    // --- Kullanıcı Girişi ---
    const { db } = await connectToDatabase();

    // Kullanıcıyı email ile bul
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta veya şifre." },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta veya şifre." },
        { status: 401 }
      );
    }

    // Hesap aktif mi?
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Hesabınız askıya alınmıştır." },
        { status: 403 }
      );
    }

    // JWT oluştur
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId: user.businessId ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(rememberMe ? "30d" : "1d")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      message: "Giriş başarılı.",
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        businessId: user.businessId ?? null,
      },
    });

    // HttpOnly cookie olarak tokenı ayarla
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}
