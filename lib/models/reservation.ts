import { ObjectId } from "mongodb"
import { connectToDatabase } from "../database"

export interface Reservation {
  _id?: ObjectId
  businessId: ObjectId
  businessName: string
  businessSlug: string
  serviceId: ObjectId
  serviceName: string
  userId?: ObjectId
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  guests: number
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
  price: number
  notes?: string
  paymentStatus: "not_required" | "pending" | "paid" | "refunded"
  paymentMethod?: "credit_card" | "debit_card" | "cash" | "bank_transfer"
  paymentId?: string
  confirmationCode: string
  cancellationReason?: string
  reminderSent: boolean
  reviewId?: ObjectId
  createdAt: Date
  updatedAt: Date
}

export class ReservationModel {
  static async create(
    reservationData: Omit<Reservation, "_id" | "confirmationCode" | "createdAt" | "updatedAt">,
  ): Promise<ObjectId> {
    const db = await connectToDatabase()

    const reservation = {
      ...reservationData,
      confirmationCode: this.generateConfirmationCode(),
      reminderSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("reservations").insertOne(reservation)
    return result.insertedId
  }

  static async findById(id: string | ObjectId): Promise<Reservation | null> {
    const db = await connectToDatabase()
    return await db.collection("reservations").findOne({ _id: new ObjectId(id) })
  }

  static async findByConfirmationCode(code: string): Promise<Reservation | null> {
    const db = await connectToDatabase()
    return await db.collection("reservations").findOne({ confirmationCode: code })
  }

  static async checkAvailability(
    businessId: string | ObjectId,
    date: string,
    time: string,
    excludeReservationId?: string | ObjectId,
  ): Promise<boolean> {
    const db = await connectToDatabase()

    const query: any = {
      businessId: new ObjectId(businessId),
      date,
      time,
      status: { $nin: ["cancelled", "no_show"] },
    }

    if (excludeReservationId) {
      query._id = { $ne: new ObjectId(excludeReservationId) }
    }

    const existingReservation = await db.collection("reservations").findOne(query)
    return !existingReservation
  }

  static async findByBusiness(
    businessId: string | ObjectId,
    filters: {
      status?: string
      date?: string
      limit?: number
      offset?: number
    } = {},
  ): Promise<Reservation[]> {
    const db = await connectToDatabase()

    const query: any = { businessId: new ObjectId(businessId) }

    if (filters.status && filters.status !== "all") {
      query.status = filters.status
    }

    if (filters.date) {
      query.date = filters.date
    }

    return await db
      .collection("reservations")
      .find(query)
      .sort({ date: -1, time: -1 })
      .limit(filters.limit || 50)
      .skip(filters.offset || 0)
      .toArray()
  }

  static async updateStatus(id: string | ObjectId, status: Reservation["status"], reason?: string): Promise<boolean> {
    const db = await connectToDatabase()

    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (reason) {
      updateData.cancellationReason = reason
    }

    const result = await db.collection("reservations").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return result.modifiedCount > 0
  }

  private static generateConfirmationCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = "RES"
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}
