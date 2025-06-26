"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "system_error":
        return "Sistem hatası oluştu. Lütfen tekrar deneyin."
      case "insufficient_funds":
        return "Yetersiz bakiye. Lütfen farklı bir kart deneyin."
      case "invalid_card":
        return "Geçersiz kart bilgileri. Lütfen kontrol edin."
      case "expired_card":
        return "Kartın süresi dolmuş. Lütfen farklı bir kart kullanın."
      case "declined":
        return "Ödeme bankanız tarafından reddedildi."
      default:
        return error || "Ödeme işlemi başarısız oldu."
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Ödeme Başarısız</CardTitle>
            <p className="text-gray-600">Rezervasyonunuz tamamlanamadı</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-700 font-medium">{getErrorMessage(error)}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Ödeme işlemi tamamlanamadı. Lütfen kart bilgilerinizi kontrol ederek tekrar deneyin. Sorun devam ederse
                bankanızla iletişime geçin.
              </p>

              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.history.back()} className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tekrar Dene
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Ana Sayfa</Link>
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>Sorun devam ederse destek ekibimizle iletişime geçin:</p>
              <p>Email: destek@rezerveet.com | Telefon: 0850 123 45 67</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
