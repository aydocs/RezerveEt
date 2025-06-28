import { type NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { DatabaseService } from "@/lib/database";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email?.toLowerCase();
    const password = body?.password;
    const rememberMe = body?.rememberMe ?? false;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-posta ve şifre gereklidir." },
        { status: 400 }
      );
    }

    // ✅ ADMIN GİRİŞİ
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail) {
      if (password !== adminPassword) {
        return NextResponse.json(
          { success: false, error: "Şifre yanlış." },
          { status: 401 }
        );
      }

      const token = await new SignJWT({
        userId: "admin",
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
          id: "admin",
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
        path: "/",
        maxAge: rememberMe ? 30 * 86400 : 86400,
      });

      return response;
    }

    // ✅ BUSINESS & USER GİRİŞİ
    let user =
      await DatabaseService.findOne<any>("businesses", { email }) ??
      await DatabaseService.findOne<any>("users", { email });

    const role = user?.role ?? "user";

    if (!user) {
      return NextResponse.json(
        { success: false, error: "E-posta adresi bulunamadı." },
        { status: 404 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Şifre yanlış." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Hesabınız askıya alınmış." },
        { status: 403 }
      );
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role,
      businessId: role === "business" ? user._id.toString() : user.businessId ?? null,
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
        role,
        businessId: role === "business" ? user._id.toString() : user.businessId ?? null,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? 30 * 86400 : 86400,
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}
