import crypto from "crypto"

// Iyzico API için HTTP client
export interface PaymentRequest {
  conversationId: string
  price: string
  paidPrice: string
  currency: string
  basketId: string
  paymentGroup: string
  buyer: {
    id: string
    name: string
    surname: string
    gsmNumber: string
    email: string
    identityNumber: string
    registrationAddress: string
    ip: string
    city: string
    country: string
  }
  shippingAddress: {
    contactName: string
    city: string
    country: string
    address: string
  }
  billingAddress: {
    contactName: string
    city: string
    country: string
    address: string
  }
  basketItems: Array<{
    id: string
    name: string
    category1: string
    itemType: string
    price: string
  }>
}

export interface PaymentResult {
  status: string
  paymentId: string
  conversationId: string
  paymentStatus: string
  errorMessage?: string
  checkoutFormContent?: string
}

export class PaymentService {
  private static getApiUrl(): string {
    return process.env.NODE_ENV === "production" ? "https://api.iyzipay.com" : "https://sandbox-api.iyzipay.com"
  }

  private static generateAuthString(requestBody: string): string {
    const apiKey = process.env.IYZICO_API_KEY || "sandbox-api-key"
    const secretKey = process.env.IYZICO_SECRET_KEY || "sandbox-secret-key"

    const randomString = Math.random().toString(36).substring(2, 15)
    const timestamp = Date.now().toString()

    const dataToSign = apiKey + randomString + timestamp + requestBody
    const hash = crypto.createHmac("sha256", secretKey).update(dataToSign).digest("base64")

    return `IYZWSv2 ${apiKey}:${randomString}:${timestamp}:${hash}`
  }

  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    const requestBody = JSON.stringify(data)
    const authString = this.generateAuthString(requestBody)

    const response = await fetch(`${this.getApiUrl()}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authString,
        Accept: "application/json",
      },
      body: requestBody,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Ödeme formu oluştur
  static async createCheckoutForm(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    try {
      const requestData = {
        locale: "tr",
        conversationId: paymentRequest.conversationId,
        price: paymentRequest.price,
        paidPrice: paymentRequest.paidPrice,
        currency: paymentRequest.currency,
        basketId: paymentRequest.basketId,
        paymentGroup: paymentRequest.paymentGroup,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
        enabledInstallments: [2, 3, 6, 9],
        buyer: paymentRequest.buyer,
        shippingAddress: paymentRequest.shippingAddress,
        billingAddress: paymentRequest.billingAddress,
        basketItems: paymentRequest.basketItems,
      }

      const result = await this.makeRequest("/payment/iyzipos/checkoutform/initialize/auth/ecom", requestData)

      return {
        status: result.status,
        paymentId: result.paymentId || "",
        conversationId: result.conversationId,
        paymentStatus: result.status === "success" ? "pending" : "failure",
        checkoutFormContent: result.checkoutFormContent,
        errorMessage: result.errorMessage,
      }
    } catch (error) {
      console.error("Checkout form creation error:", error)
      return {
        status: "failure",
        paymentId: "",
        conversationId: paymentRequest.conversationId,
        paymentStatus: "failure",
        errorMessage: "Ödeme formu oluşturulamadı",
      }
    }
  }

  // Ödeme sonucunu kontrol et
  static async retrieveCheckoutForm(token: string): Promise<PaymentResult> {
    try {
      const requestData = {
        locale: "tr",
        token: token,
      }

      const result = await this.makeRequest("/payment/iyzipos/checkoutform/auth/ecom/detail", requestData)

      return {
        status: result.status,
        paymentId: result.paymentId || "",
        conversationId: result.conversationId,
        paymentStatus: result.paymentStatus,
        errorMessage: result.errorMessage,
      }
    } catch (error) {
      console.error("Payment retrieval error:", error)
      return {
        status: "failure",
        paymentId: "",
        conversationId: "",
        paymentStatus: "failure",
        errorMessage: "Ödeme bilgisi alınamadı",
      }
    }
  }

  // İade işlemi
  static async refundPayment(paymentTransactionId: string, price: string, currency = "TRY"): Promise<boolean> {
    try {
      const requestData = {
        locale: "tr",
        conversationId: `refund-${Date.now()}`,
        paymentTransactionId: paymentTransactionId,
        price: price,
        currency: currency,
        ip: "127.0.0.1",
      }

      const result = await this.makeRequest("/payment/refund", requestData)
      return result.status === "success"
    } catch (error) {
      console.error("Refund error:", error)
      return false
    }
  }

  // Mock ödeme (test için)
  static async createMockPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    // Development ortamında mock ödeme
    if (process.env.NODE_ENV === "development") {
      return {
        status: "success",
        paymentId: `mock_${Date.now()}`,
        conversationId: paymentRequest.conversationId,
        paymentStatus: "SUCCESS",
        checkoutFormContent: `
          <div style="padding: 20px; border: 2px solid #4CAF50; border-radius: 8px; text-align: center;">
            <h3>Mock Ödeme Formu</h3>
            <p>Test ortamında çalışıyorsunuz</p>
            <button onclick="window.parent.postMessage('payment_success', '*')" 
                    style="background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
              Ödemeyi Tamamla (Test)
            </button>
          </div>
        `,
      }
    }

    return this.createCheckoutForm(paymentRequest)
  }
}
