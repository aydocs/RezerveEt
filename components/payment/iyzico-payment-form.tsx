"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface IyzicoPaymentFormProps {
  amount: number
  reservationId: string
  userInfo: {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone: string
    city?: string
    address?: string
    identityNumber?: string
  }
  reservationDetails?: {
    serviceName: string
    businessName: string
    date: string
    time: string
  }
  onSuccess: () => void
  onError: (error: string) => void
}

export function IyzicoPaymentForm({
  amount,
  reservationId,
  userInfo,
  reservationDetails,
  onSuccess,
  onError,
}: IyzicoPaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    phone: userInfo.phone,
    city: userInfo.city || "İstanbul",
    address: userInfo.address || "",
    identityNumber: userInfo.identityNumber || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Form validasyonu
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        onError("Lütfen tüm zorunlu alanları doldurun")
        setLoading(false)
        return
      }

      // Email validasyonu
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        onError("Geçerli bir email adresi girin")
        setLoading(false)
        return
      }

      // Telefon validasyonu
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        onError("Geçerli bir telefon numarası girin")
        setLoading(false)
        return
      }

      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId,
          amount,
          userInfo: formData,
          reservationDetails,
        }),
      })

      const data = await response.json()

      if (data.success && data.checkoutFormContent) {
        // Iyzico ödeme formunu yeni pencerede aç
        const paymentWindow = window.open("", "iyzico-payment", "width=800,height=600,scrollbars=yes,resizable=yes")
        if (paymentWindow) {
          paymentWindow.document.write(data.checkoutFormContent)
          paymentWindow.document.close()

          // Ödeme penceresini kontrol et
          const checkClosed = setInterval(() => {
            if (paymentWindow.closed) {
              clearInterval(checkClosed)
              // Ödeme durumunu kontrol et
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            }
          }, 1000)
        } else {
          onError("Popup engellenmiş. Lütfen popup engelleyiciyi kapatın.")
        }
      } else {
        onError(data.error || "Ödeme işlemi başlatılamadı")
      }
    } catch (error) {
      console.error("Ödeme hatası:", error)
      onError("Ödeme işlemi sırasında bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Ödeme Bilgileri</CardTitle>
        {reservationDetails && (
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Hizmet:</strong> {reservationDetails.serviceName}
            </p>
            <p>
              <strong>İşletme:</strong> {reservationDetails.businessName}
            </p>
            <p>
              <strong>Tarih:</strong> {reservationDetails.date}
            </p>
            <p>
              <strong>Saat:</strong> {reservationDetails.time}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Ad *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Adınız"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Soyad *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Soyadınız"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefon *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="05xxxxxxxxx"
            required
          />
        </div>

        <div>
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="İstanbul"
          />
        </div>

        <div>
          <Label htmlFor="address">Adres</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Adres bilginiz"
          />
        </div>

        <div>
          <Label htmlFor="identityNumber">TC Kimlik No</Label>
          <Input
            id="identityNumber"
            value={formData.identityNumber}
            onChange={(e) => handleInputChange("identityNumber", e.target.value)}
            placeholder="11111111111"
            maxLength={11}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Toplam Tutar:</span>
            <span className="text-2xl font-bold text-green-600">₺{amount}</span>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                İşleniyor...
              </>
            ) : (
              `₺${amount} Öde`
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Ödeme işlemi Iyzico güvencesi altında gerçekleştirilir.</p>
          <p>Kart bilgileriniz güvenli şekilde şifrelenir.</p>
        </div>
      </CardContent>
    </Card>
  )
}
