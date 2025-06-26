import { Redis } from "@upstash/redis"
import { config } from "./config"

// Upstash Redis client
const redis = new Redis({
  url: config.redis.upstash.restUrl,
  token: config.redis.upstash.restToken,
})

export class CacheService {
  // Cache'e veri kaydet
  static async set(key: string, value: any, ttl = 3600): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), { ex: ttl })
    } catch (error) {
      console.error("Cache set error:", error)
    }
  }

  // Cache'den veri al
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value as string) : null
    } catch (error) {
      console.error("Cache get error:", error)
      return null
    }
  }

  // Cache'den veri sil
  static async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error("Cache delete error:", error)
    }
  }

  // Cache'i temizle
  static async clear(pattern = "*"): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error("Cache clear error:", error)
    }
  }

  // Cache durumunu kontrol et
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.error("Cache exists error:", error)
      return false
    }
  }
}
