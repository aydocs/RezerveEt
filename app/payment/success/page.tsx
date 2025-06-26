"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const reservationId = searchParams.get("reservationId")
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (reservationId) {
      // Rezervasyon detaylarını getir
      fetch(`/api/reservations/${reservationId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReservation(data.reservation)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [reservationId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Ödeme Başarılı!</CardTitle>
            <p className="text-gray-600">Rezervasyonunuz onaylandı</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {reservation && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">Rezervasyon Detayları</h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{reservation.businessName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{reservation.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{reservation.time}</span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span>Rezervasyon No:</span>
                    <span className="font-mono">{reservationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ödenen Tutar:</span>
                    <span className="font-semibold">₺{reservation.amount}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Rezervasyon onay maili email adresinize gönderildi. Rezervasyon detaylarını dashboard'unuzdan takip
                edebilirsiniz.
              </p>

              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link href="/dashboard/user">Dashboard'a Git</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Ana Sayfa</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
