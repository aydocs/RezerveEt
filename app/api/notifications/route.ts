import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"
import { NotificationService } from "@/lib/notification-service"

export async function GET(request: NextRequest) {
  try {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Giriş gerekli" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const notifications = await NotificationService.getUserNotifications(user.id, limit)

    return NextResponse.json({
      success: true,
      data: notifications,
    })
  } catch (error) {
    console.error("Notifications API error:", error)
    return NextResponse.json({ success: false, error: "Bildirimler yüklenirken hata oluştu" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Giriş gerekli" }, { status: 401 })
    }

    const { notificationId, markAllAsRead } = await request.json()

    if (markAllAsRead) {
      await NotificationService.markAllAsRead(user.id)
    } else if (notificationId) {
      await NotificationService.markAsRead(notificationId, user.id)
    }

    return NextResponse.json({
      success: true,
      message: "Bildirimler okundu olarak işaretlendi",
    })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ success: false, error: "Bildirim güncellenirken hata oluştu" }, { status: 500 })
  }
}
