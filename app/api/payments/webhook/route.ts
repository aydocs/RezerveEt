import { type NextRequest, NextResponse } from "next/server"
import { PaymentService } from "@/lib/payment-service"
import { ReservationModel } from "@/lib/models/reservation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    const event = await PaymentService.handleWebhook(body, signature)
    if (!event) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as any
        const reservationId = paymentIntent.metadata.reservationId

        if (reservationId) {
          // Rezervasyon ödeme durumunu güncelle
          await ReservationModel.update(reservationId, {
            paymentStatus: "paid",
            paymentId: paymentIntent.id,
            status: "confirmed",
          })
        }
        break

      case "payment_intent.payment_failed":
        // Ödeme başarısız olduğunda gerekli işlemler
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
