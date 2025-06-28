import { type NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/database";

const secretKey = process.env.JWT_SECRET ?? "dev-secret";
const secret = new TextEncoder().encode(secretKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email?.toLowerCase();
    const password = body?.password;
    const rememberMe = body?.rememberMe ?? false;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-posta ve şifre gereklidir" },
        { status: 400 }
      );
    }

    const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
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
        message: "Admin girişi başarılı",
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
        maxAge: rememberMe ? 30 * 86400 : 86400,
      });

      return response;
    }

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Hesabınız askıya alınmıştır" },
        { status: 403 }
      );
    }

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
      message: "Giriş başarılı",
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        businessId: user.businessId ?? null,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 30 * 86400 : 86400,
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error?.message || error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}
