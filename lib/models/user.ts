import { ObjectId } from "mongodb"
import { connectToDatabase } from "../database"

export interface User {
  _id?: ObjectId
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  role: "user" | "business" | "admin"
  businessId?: ObjectId
  isActive: boolean
  emailVerified: boolean
  phoneVerified: boolean
  avatar?: string
  preferences?: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    language: string
  }
  createdAt: Date
  updatedAt: Date
}

export class UserModel {
  static async create(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
    const db = await connectToDatabase()
    const user = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(user)
    return result.insertedId
  }

  static async findById(id: string | ObjectId): Promise<User | null> {
    const db = await connectToDatabase()
    return await db.collection("users").findOne({ _id: new ObjectId(id) })
  }

  static async findByEmail(email: string): Promise<User | null> {
    const db = await connectToDatabase()
    return await db.collection("users").findOne({ email: email.toLowerCase() })
  }

  static async update(id: string | ObjectId, updateData: Partial<User>): Promise<boolean> {
    const db = await connectToDatabase()
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }

  static async delete(id: string | ObjectId): Promise<boolean> {
    const db = await connectToDatabase()
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async findMany(filter: any = {}, options: any = {}): Promise<User[]> {
    const db = await connectToDatabase()
    return await db
      .collection("users")
      .find(filter)
      .sort(options.sort || { createdAt: -1 })
      .limit(options.limit || 50)
      .skip(options.skip || 0)
      .toArray()
  }
}
