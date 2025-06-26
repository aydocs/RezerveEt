import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export interface User {
  userId: string
  email: string
  role: "user" | "business" | "admin"
  firstName?: string
  lastName?: string
  phone?: string
  businessId?: string
}

export async function verifyToken(token?: string): Promise<User | null> {
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as User
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value
  return verifyToken(token)
}

export async function createToken(user: User): Promise<string> {
  return await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret)
}

export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get("auth-token")?.value || null
}
