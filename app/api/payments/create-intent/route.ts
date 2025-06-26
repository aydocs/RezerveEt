import { type NextRequest, NextResponse } from "next/server"
import { PaymentService } from "@/lib/payment-service"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "try", metadata = {} } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Geçerli bir tutar giriniz" }, { status: 400 })
    }

    const paymentIntent = await PaymentService.createPaymentIntent(amount, currency, metadata)

    return NextResponse.json({
      success: true,
      paymentIntent,
      message: "Ödeme işlemi başlatıldı (Mock)",
    })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Ödeme işlemi başlatılamadı" }, { status: 500 })
  }
}
