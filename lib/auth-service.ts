import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "business" | "admin";
  businessId?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
}

export class AuthService {
  // Şifreyi hashler
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Şifreyi doğrular
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // JWT token oluşturur
  static async createToken(user: User): Promise<string> {
    return new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);
  }

  // JWT token doğrular
  static async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch {
      return null;
    }
  }

  // Aktif kullanıcıyı cookie'den alır
  static async getCurrentUser(): Promise<User | null> {
    const cookieStore = cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const payload = await this.verifyToken(token);
    if (!payload) return null;

    // Burada veritabanından kullanıcıyı çekmelisin.
    // const user = await getUserById(payload.userId);
    // return user;

    return null; // Şimdilik mock olarak null dönüyor
  }

  // Yetki kontrolü yapar, gerekirse yönlendirir
  static async requireAuth(requiredRole?: string) {
    const user = await this.getCurrentUser();

    if (!user) {
      redirect("/login");
    }

    if (requiredRole && user.role !== requiredRole) {
      redirect("/");
    }

    return user;
  }

  // Çıkış yapar ve çerez siler
  static async logout() {
    const cookieStore = cookies();
    cookieStore.delete("auth-token");
    redirect("/login");
  }
}
