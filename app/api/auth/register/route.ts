import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import { AuthService } from "@/lib/auth-service";
import { sendVerificationEmail } from "@/lib/email-service";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, password, role = "user" } = await request.json();

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

    const { db } = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 409 }
      );
    }

    const hashedPassword = await AuthService.hashPassword(password);

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

    await sendVerificationEmail(email, result.insertedId.toString());

    return NextResponse.json(
      {
        success: true,
        message:
          "Hesabınız başarıyla oluşturuldu. E-posta adresinize doğrulama linki gönderildi.",
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
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Kayıt olurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
