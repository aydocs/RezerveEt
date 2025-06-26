import { type NextRequest, NextResponse } from "next/server"
import { PaymentService } from "@/lib/payment-service"
import { ReservationModel } from "@/lib/models/reservation"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const token = formData.get("token") as string

    if (!token) {
      return NextResponse.json({ error: "Token bulunamadı" }, { status: 400 })
    }

    // Mock ödeme için özel kontrol
    if (token === "mock_payment_success") {
      const reservationId = formData.get("reservationId") as string

      if (reservationId) {
        await ReservationModel.update(reservationId, {
          paymentStatus: "paid",
          paymentId: `mock_${Date.now()}`,
          status: "confirmed",
          updatedAt: new Date(),
        })
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/success?reservationId=${reservationId}`)
    }

    // Gerçek Iyzico ödeme kontrolü
    const paymentResult = await PaymentService.retrieveCheckoutForm(token)

    if (paymentResult.status === "success" && paymentResult.paymentStatus === "SUCCESS") {
      await ReservationModel.update(paymentResult.conversationId, {
        paymentStatus: "paid",
        paymentId: paymentResult.paymentId,
        status: "confirmed",
        updatedAt: new Date(),
      })

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?reservationId=${paymentResult.conversationId}`,
      )
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=${encodeURIComponent(paymentResult.errorMessage || "Ödeme başarısız")}`,
      )
    }
  } catch (error) {
    console.error("Ödeme callback hatası:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=system_error`)
  }
}

// GET method for testing
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")

  if (token === "test") {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/success?test=true`)
  }

  return NextResponse.json({ message: "Payment callback endpoint" })
}
