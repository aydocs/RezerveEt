import { connectToDatabase } from "./database"
import { sendReservationConfirmation, sendReservationReminder } from "./email-service"
import { sendSMS } from "./sms-service"

export interface Notification {
  _id?: string
  userId: string
  type: "reservation_confirmed" | "reservation_reminder" | "reservation_cancelled" | "business_approved"
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: Date
}

export class NotificationService {
  static async create(notification: Omit<Notification, "_id" | "read" | "createdAt">) {
    const db = await connectToDatabase()

    const newNotification = {
      ...notification,
      read: false,
      createdAt: new Date(),
    }

    await db.collection("notifications").insertOne(newNotification)
  }

  static async sendReservationNotification(
    type: "confirmed" | "reminder" | "cancelled",
    reservation: any,
    business: any,
  ) {
    try {
      // E-posta bildirimi
      if (type === "confirmed") {
        await sendReservationConfirmation(reservation.customerEmail, {
          ...reservation,
          businessPhone: business.phone,
        })
      } else if (type === "reminder") {
        await sendReservationReminder(reservation.customerEmail, reservation)
      }

      // SMS bildirimi (eğer kullanıcı izin verdiyse)
      if (reservation.smsNotifications) {
        const message = this.getSMSMessage(type, reservation, business)
        await sendSMS(reservation.customerPhone, message)
      }

      // In-app bildirim
      if (reservation.userId) {
        await this.create({
          userId: reservation.userId,
          type: `reservation_${type}` as any,
          title: this.getNotificationTitle(type),
          message: this.getNotificationMessage(type, reservation, business),
          data: { reservationId: reservation._id },
        })
      }
    } catch (error) {
      console.error("Notification sending error:", error)
    }
  }

  static async getUserNotifications(userId: string, limit = 20) {
    const db = await connectToDatabase()

    return await db.collection("notifications").find({ userId }).sort({ createdAt: -1 }).limit(limit).toArray()
  }

  static async markAsRead(notificationId: string, userId: string) {
    const db = await connectToDatabase()

    await db.collection("notifications").updateOne({ _id: notificationId, userId }, { $set: { read: true } })
  }

  static async markAllAsRead(userId: string) {
    const db = await connectToDatabase()

    await db.collection("notifications").updateMany({ userId, read: false }, { $set: { read: true } })
  }

  private static getSMSMessage(type: string, reservation: any, business: any): string {
    switch (type) {
      case "confirmed":
        return `RezerveEt: ${business.name} rezervasyonunuz onaylandı. Tarih: ${reservation.date} ${reservation.time}. Kod: ${reservation.confirmationCode}`
      case "reminder":
        return `RezerveEt: ${business.name} rezervasyonunuz yarın ${reservation.time}'de. Kod: ${reservation.confirmationCode}`
      case "cancelled":
        return `RezerveEt: ${business.name} rezervasyonunuz iptal edildi. Kod: ${reservation.confirmationCode}`
      default:
        return ""
    }
  }

  private static getNotificationTitle(type: string): string {
    switch (type) {
      case "confirmed":
        return "Rezervasyon Onaylandı"
      case "reminder":
        return "Rezervasyon Hatırlatması"
      case "cancelled":
        return "Rezervasyon İptal Edildi"
      default:
        return "Bildirim"
    }
  }

  private static getNotificationMessage(type: string, reservation: any, business: any): string {
    switch (type) {
      case "confirmed":
        return `${business.name} rezervasyonunuz onaylandı. Tarih: ${reservation.date} ${reservation.time}`
      case "reminder":
        return `${business.name} rezervasyonunuz yarın ${reservation.time}'de`
      case "cancelled":
        return `${business.name} rezervasyonunuz iptal edildi`
      default:
        return ""
    }
  }
}
