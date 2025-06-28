import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

// Ortak JWT sırrı
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

// User tipi (JWT'de taşınacak olan bilgiler)
export interface User {
  userId: string;
  email: string;
  role: "user" | "business" | "admin";
  firstName?: string;
  lastName?: string;
  phone?: string;
  businessId?: string | null;
}

// JWT içine yazılacak payload tipi
type UserJWTPayload = Pick<User, "userId" | "email" | "role" | "businessId">;

/**
 * JWT token oluşturur
 */
export async function createToken(user: User): Promise<string> {
  const payload: UserJWTPayload = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    businessId: user.businessId ?? null,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * JWT token'ı doğrular ve User verisini döner
 */
export async function verifyToken(token?: string): Promise<User | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    // Tip kontrolü
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.role === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role as User["role"],
        businessId: payload.businessId as string | undefined,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Mevcut kullanıcıyı cookie üzerinden döner
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies(); // sync (next/headers)
  const token = cookieStore.get("auth-token")?.value;
  return await verifyToken(token);
}

/**
 * Request üzerinden token'ı döner (API route'lar için)
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get("auth-token")?.value || null;
}
