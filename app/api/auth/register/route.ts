import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/database";
import { sendVerificationEmail } from "@/lib/email-service"; // Bu fonksiyonu kendin implement etmelisin

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password, role = "user" } = await request.json();

    // Basit validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Tüm alanlar zorunludur" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // DB bağlantısı
    const { db } = await connectToDatabase();

    // Email zaten kayıtlı mı?
    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // Yeni kullanıcı objesi
    const newUser = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    // Doğrulama e-postası gönder (async hata yakalama yapabilirsin)
    await sendVerificationEmail(email, result.insertedId.toString());

    return NextResponse.json(
      {
        success: true,
        message: "Hesabınız başarıyla oluşturuldu. E-posta adresinize doğrulama linki gönderildi.",
        user: {
          id: result.insertedId,
          firstName,
          lastName,
          email: email.toLowerCase(),
          role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Kayıt olurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
