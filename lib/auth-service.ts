import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DatabaseService } from "@/lib/database";

// GEREKEN TİPLER BURADA TANIMLANIYOR
export interface DbUser {
  _id: any;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "business";
  businessId?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt?: Date;
}

// Sistem içinde kullanılacak sadeleştirilmiş user tipi
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "business" | "admin";
  businessId?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt?: Date;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async createToken(user: User): Promise<string> {
    return new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      businessId: user.businessId ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);
  }

  static async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch {
      return null;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const cookieStore = await  cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;

    const payload: any = await this.verifyToken(token);
    if (!payload) return null;

    // Admin ise mock dön
    if (payload.role === "admin") {
      return {
        id: "admin",
        email: payload.email,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        businessId: null,
        isActive: true,
        emailVerified: true,
      };
    }

    // DB'den user/business çek
    let user: DbUser | null = null;
    if (payload.role === "business") {
      user = await DatabaseService.findOne<DbUser>("businesses", { _id: payload.userId });
    } else if (payload.role === "user") {
      user = await DatabaseService.findOne<DbUser>("users", { _id: payload.userId });
    }

    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      businessId: user.businessId ?? null,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }

  static async requireAuth(requiredRole?: "user" | "business" | "admin") {
    const user = await this.getCurrentUser();
    if (!user) redirect("/login");

    if (requiredRole && user.role !== requiredRole) {
      redirect("/");
    }

    return user;
  }

  static async logout() {
    const cookieStore = await  cookies();
    cookieStore.set("auth-token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    redirect("/login");
  }
}
