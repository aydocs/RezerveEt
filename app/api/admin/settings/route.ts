import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    const settings = await DatabaseService.findMany("settings", {})

    // Settings'i key-value formatına çevir
    const settingsMap = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: settingsMap,
    })
  } catch (error) {
    console.error("Settings API error:", error)
    return NextResponse.json({ success: false, error: "Ayarlar yüklenirken hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 403 })
    }

    const settings = await request.json()

    // Her ayarı veritabanına kaydet
    for (const [key, value] of Object.entries(settings)) {
      await DatabaseService.updateOne(
        "settings",
        { key },
        {
          key,
          value,
          updatedAt: new Date(),
          updatedBy: user.userId,
        },
        { upsert: true },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Ayarlar başarıyla kaydedildi",
    })
  } catch (error) {
    console.error("Settings save error:", error)
    return NextResponse.json({ success: false, error: "Ayarlar kaydedilirken hata oluştu" }, { status: 500 })
  }
}
