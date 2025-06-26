import { type NextRequest, NextResponse } from "next/server"
import { ReservationModel } from "@/lib/models/reservation"
import { BusinessModel } from "@/lib/models/business"
import { sendReservationConfirmation } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validasyon
    const requiredFields = [
      "businessId",
      "serviceId",
      "customerName",
      "customerEmail",
      "customerPhone",
      "date",
      "time",
      "guests",
    ]

    const missingFields = requiredFields.filter((field) => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Eksik alanlar",
          missingFields,
        },
        { status: 400 },
      )
    }

    // Tarih kontrolü
    const reservationDate = new Date(`${body.date}T${body.time}:00`)
    const now = new Date()

    if (reservationDate <= now) {
      return NextResponse.json(
        {
          success: false,
          error: "Rezervasyon tarihi geçmiş bir tarih olamaz",
        },
        { status: 400 },
      )
    }

    // Müsaitlik kontrolü
    const isAvailable = await ReservationModel.checkAvailability(body.businessId, body.date, body.time)

    if (!isAvailable) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu tarih ve saat için zaten bir rezervasyon bulunmaktadır",
        },
        { status: 409 },
      )
    }

    // İşletme bilgilerini al
    const business = await BusinessModel.findById(body.businessId)
    if (!business) {
      return NextResponse.json(
        {
          success: false,
          error: "İşletme bulunamadı",
        },
        { status: 404 },
      )
    }

    // Rezervasyon oluştur
    const reservationData = {
      businessId: body.businessId,
      businessName: business.name,
      businessSlug: business.slug,
      serviceId: body.serviceId,
      serviceName: body.serviceName || "Hizmet",
      userId: body.userId || null,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      date: body.date,
      time: body.time,
      guests: body.guests,
      status: business.settings.autoApprove ? "confirmed" : "pending",
      price: body.price || 0,
      notes: body.notes || "",
      paymentStatus: body.paymentRequired ? "pending" : "not_required",
      paymentMethod: body.paymentMethod || null,
    }

    const reservationId = await ReservationModel.create(reservationData)
    const reservation = await ReservationModel.findById(reservationId)

    // E-posta bildirimi gönder
    await sendReservationConfirmation(body.customerEmail, {
      ...reservation,
      businessPhone: business.phone,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Rezervasyonunuz başarıyla oluşturuldu",
        data: {
          reservationId: reservationId.toString(),
          confirmationCode: reservation?.confirmationCode,
          status: reservation?.status,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Reservation creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Rezervasyon oluşturulurken bir hata oluştu",
      },
      { status: 500 },
    )
  }
}
