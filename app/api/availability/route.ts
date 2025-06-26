import { type NextRequest, NextResponse } from "next/server"

// Mock rezervasyon verileri - gerçek uygulamada veritabanından gelecek
const mockReservations = [
  {
    businessId: 1,
    date: "2024-01-25",
    time: "19:30",
    status: "confirmed",
  },
  {
    businessId: 1,
    date: "2024-01-25",
    time: "20:00",
    status: "confirmed",
  },
  {
    businessId: 2,
    date: "2024-01-20",
    time: "14:00",
    status: "confirmed",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")
    const date = searchParams.get("date")
    const serviceId = searchParams.get("serviceId")

    if (!businessId || !date) {
      return NextResponse.json({ success: false, error: "businessId ve date parametreleri gerekli" }, { status: 400 })
    }

    // İşletmenin o tarihteki rezervasyonlarını bul
    const existingReservations = mockReservations.filter(
      (r) => r.businessId === Number.parseInt(businessId) && r.date === date && r.status !== "cancelled",
    )

    // Çalışma saatleri (gerçek uygulamada işletmenin ayarlarından gelecek)
    const workingHours = {
      start: "09:00",
      end: "22:00",
      interval: 30, // 30 dakika aralıklar
    }

    // Mevcut saatleri oluştur
    const availableTimes: string[] = []
    const startHour = Number.parseInt(workingHours.start.split(":")[0])
    const startMinute = Number.parseInt(workingHours.start.split(":")[1])
    const endHour = Number.parseInt(workingHours.end.split(":")[0])
    const endMinute = Number.parseInt(workingHours.end.split(":")[1])

    let currentHour = startHour
    let currentMinute = startMinute

    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`

      // Bu saat rezerve edilmiş mi kontrol et
      const isReserved = existingReservations.some((r) => r.time === timeString)

      if (!isReserved) {
        availableTimes.push(timeString)
      }

      // Sonraki zaman dilimini hesapla
      currentMinute += workingHours.interval
      if (currentMinute >= 60) {
        currentHour += 1
        currentMinute = 0
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        date,
        businessId: Number.parseInt(businessId),
        availableTimes,
        totalSlots: availableTimes.length,
      },
    })
  } catch (error) {
    console.error("Availability API Error:", error)
    return NextResponse.json({ success: false, error: "Müsaitlik kontrolü sırasında bir hata oluştu" }, { status: 500 })
  }
}
