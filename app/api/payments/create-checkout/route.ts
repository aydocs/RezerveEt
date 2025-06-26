import { type NextRequest, NextResponse } from "next/server"
import { PaymentService, type PaymentRequest } from "@/lib/payment-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Ödeme isteği verilerini hazırla
    const paymentRequest: PaymentRequest = {
      conversationId: body.reservationId,
      price: body.amount.toString(),
      paidPrice: body.amount.toString(),
      currency: "TRY",
      basketId: `basket_${body.reservationId}`,
      paymentGroup: "PRODUCT",
      buyer: {
        id: body.buyer.id,
        name: body.buyer.name,
        surname: body.buyer.surname,
        gsmNumber: body.buyer.phone,
        email: body.buyer.email,
        identityNumber: body.buyer.identityNumber || "11111111111",
        registrationAddress: body.buyer.address,
        ip: request.ip || "127.0.0.1",
        city: body.buyer.city,
        country: "Turkey",
      },
      shippingAddress: {
        contactName: `${body.buyer.name} ${body.buyer.surname}`,
        city: body.buyer.city,
        country: "Turkey",
        address: body.buyer.address,
      },
      billingAddress: {
        contactName: `${body.buyer.name} ${body.buyer.surname}`,
        city: body.buyer.city,
        country: "Turkey",
        address: body.buyer.address,
      },
      basketItems: [
        {
          id: body.reservationId,
          name: body.serviceName,
          category1: "Rezervasyon",
          itemType: "VIRTUAL",
          price: body.amount.toString(),
        },
      ],
    }

    // Development ortamında mock ödeme kullan
    const result = await PaymentService.createMockPayment(paymentRequest)

    if (result.status === "success") {
      return NextResponse.json({
        success: true,
        checkoutFormContent: result.checkoutFormContent,
        paymentId: result.paymentId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.errorMessage || "Ödeme formu oluşturulamadı",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 })
  }
}
