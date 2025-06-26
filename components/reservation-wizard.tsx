"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Users, CreditCard, CheckCircle, ArrowLeft, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { IyzicoPaymentForm } from "@/components/payment/iyzico-payment-form"

interface Service {
  id: number
  name: string
  duration: number
  price: number
  description: string
}

interface ReservationWizardProps {
  business: {
    id: number
    name: string
    slug: string
  }
  services: Service[]
  isOpen: boolean
  onClose: () => void
}

const steps = [
  { id: 1, title: "Giriş", icon: User },
  { id: 2, title: "Hizmet Seçimi", icon: Calendar },
  { id: 3, title: "Tarih & Saat", icon: Clock },
  { id: 4, title: "Bilgiler", icon: Users },
  { id: 5, title: "Ödeme", icon: CreditCard },
  { id: 6, title: "Onay", icon: CheckCircle },
]

const availableTimes = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
]

export function ReservationWizard({ business, services, isOpen, onClose }: ReservationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [reservationData, setReservationData] = useState({
    serviceId: "",
    date: undefined as Date | undefined,
    time: "",
    guests: "1",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
    paymentMethod: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const selectedService = services.find((s) => s.id.toString() === reservationData.serviceId)

  // Kullanıcı giriş durumunu kontrol et
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        setIsLoggedIn(true)
        setReservationData((prev) => ({
          ...prev,
          customerName: `${userData.user.firstName} ${userData.user.lastName}`,
          customerEmail: userData.user.email,
          customerPhone: userData.user.phone || "",
        }))
      }
    } catch (error) {
      console.error("Auth check error:", error)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    setLoginError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        setIsLoggedIn(true)
        setReservationData((prev) => ({
          ...prev,
          customerName: `${data.user.firstName} ${data.user.lastName}`,
          customerEmail: data.user.email,
          customerPhone: data.user.phone || "",
        }))
        nextStep()
      } else {
        setLoginError(data.error || "Giriş yapılırken bir hata oluştu")
      }
    } catch (error) {
      setLoginError("Bağlantı hatası. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReservationSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          businessName: business.name,
          businessSlug: business.slug,
          serviceId: reservationData.serviceId,
          serviceName: selectedService?.name,
          userId: user?.id,
          customerName: reservationData.customerName,
          customerEmail: reservationData.customerEmail,
          customerPhone: reservationData.customerPhone,
          date: reservationData.date?.toISOString().split("T")[0],
          time: reservationData.time,
          guests: Number.parseInt(reservationData.guests),
          notes: reservationData.notes,
          price: calculateTotalPrice(),
          paymentRequired: true,
          paymentMethod: reservationData.paymentMethod,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (reservationData.paymentMethod !== "cash") {
          setShowPayment(true)
        } else {
          nextStep() // Nakit ödeme için direkt onay adımına geç
        }
      } else {
        alert(data.error || "Rezervasyon oluşturulurken bir hata oluştu")
      }
    } catch (error) {
      console.error("Rezervasyon hatası:", error)
      alert("Rezervasyon oluşturulurken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!selectedService) return 0
    return selectedService.price * Number.parseInt(reservationData.guests)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return isLoggedIn
      case 2:
        return reservationData.serviceId !== ""
      case 3:
        return reservationData.date && reservationData.time !== ""
      case 4:
        return reservationData.customerName && reservationData.customerEmail && reservationData.customerPhone
      case 5:
        return reservationData.paymentMethod !== ""
      default:
        return true
    }
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    nextStep()
  }

  const handlePaymentError = (error: string) => {
    alert(error)
    setShowPayment(false)
  }

  if (showPayment && selectedService) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <IyzicoPaymentForm
            amount={calculateTotalPrice()}
            reservationId="temp-id"
            userInfo={{
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              email: user?.email || "",
              phone: user?.phone || "",
            }}
            reservationDetails={{
              serviceName: selectedService.name,
              businessName: business.name,
              date: reservationData.date?.toLocaleDateString("tr-TR") || "",
              time: reservationData.time,
            }}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{business.name} - Rezervasyon</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id ? "bg-blue-700 border-blue-700 text-white" : "border-gray-300 text-gray-400"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <step.icon className="h-5 w-5" />
              </motion.div>
              <div className="ml-2 hidden sm:block">
                <p className={`text-xs font-medium ${currentStep >= step.id ? "text-blue-700" : "text-gray-500"}`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-16 h-0.5 ml-4 ${currentStep > step.id ? "bg-blue-700" : "bg-gray-300"}`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px]"
          >
            {/* Step 1: Login */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Giriş Yapın</h3>
                  <p className="text-gray-600">Rezervasyon yapmak için giriş yapmanız gerekiyor</p>
                </div>

                {!isLoggedIn ? (
                  <div className="max-w-md mx-auto space-y-4">
                    {loginError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {loginError}
                      </div>
                    )}

                    <div>
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Şifre</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      />
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={isLoading || !loginData.email || !loginData.password}
                      className="w-full bg-blue-700 hover:bg-blue-800"
                    >
                      {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                      Hesabınız yok mu?{" "}
                      <a href="/register" className="text-blue-700 hover:underline">
                        Üye olun
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                      Hoş geldiniz, {user?.firstName} {user?.lastName}!
                    </div>
                    <p className="text-gray-600">Rezervasyon yapmaya devam edebilirsiniz.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Service Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Hizmet Seçin</h3>
                  <p className="text-gray-600">Rezervasyon yapmak istediğiniz hizmeti seçin</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        reservationData.serviceId === service.id.toString() ? "ring-2 ring-blue-700 bg-blue-50" : ""
                      }`}
                      onClick={() => setReservationData((prev) => ({ ...prev, serviceId: service.id.toString() }))}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold">{service.name}</h4>
                          <Badge className="bg-green-600">₺{service.price}/kişi</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration} dakika
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Tarih ve Saat Seçin</h3>
                  <p className="text-gray-600">Uygun bir tarih ve saat seçin</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Tarih Seçin</Label>
                    <CalendarComponent
                      mode="single"
                      selected={reservationData.date}
                      onSelect={(date) => setReservationData((prev) => ({ ...prev, date }))}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-4 block">Saat Seçin</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={reservationData.time === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setReservationData((prev) => ({ ...prev, time }))}
                          className={`h-10 ${reservationData.time === time ? "bg-blue-700 hover:bg-blue-800" : ""}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="guests" className="text-base font-medium">
                    Kişi Sayısı
                  </Label>
                  <Select
                    value={reservationData.guests}
                    onValueChange={(value) => setReservationData((prev) => ({ ...prev, guests: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} kişi
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedService && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Toplam Tutar:</strong> ₺{calculateTotalPrice()}({reservationData.guests} kişi × ₺
                      {selectedService.price})
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Customer Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">İletişim Bilgileri</h3>
                  <p className="text-gray-600">Rezervasyon için gerekli bilgileri kontrol edin</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Ad Soyad *</Label>
                    <Input
                      id="customerName"
                      placeholder="Adınız ve soyadınız"
                      className="mt-1"
                      value={reservationData.customerName}
                      onChange={(e) => setReservationData((prev) => ({ ...prev, customerName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Telefon *</Label>
                    <Input
                      id="customerPhone"
                      placeholder="0555 123 45 67"
                      className="mt-1"
                      value={reservationData.customerPhone}
                      onChange={(e) => setReservationData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerEmail">E-posta *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="ornek@email.com"
                    className="mt-1"
                    value={reservationData.customerEmail}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Özel İstek (Opsiyonel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
                    className="mt-1"
                    value={reservationData.notes}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Payment */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Ödeme Yöntemi</h3>
                  <p className="text-gray-600">Ödeme yönteminizi seçin</p>
                </div>

                {/* Reservation Summary */}
                <Card className="bg-gray-50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Rezervasyon Özeti</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Hizmet:</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tarih:</span>
                        <span className="font-medium">{reservationData.date?.toLocaleDateString("tr-TR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saat:</span>
                        <span className="font-medium">{reservationData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kişi Sayısı:</span>
                        <span className="font-medium">{reservationData.guests} kişi</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Birim Fiyat:</span>
                        <span className="font-medium">₺{selectedService?.price}/kişi</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Toplam:</span>
                          <span>₺{calculateTotalPrice()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Ödeme Yöntemi Seçin</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: "credit_card", name: "Kredi Kartı", icon: "💳" },
                      { id: "debit_card", name: "Banka Kartı", icon: "💳" },
                      { id: "cash", name: "Nakit (İşletmede)", icon: "💵" },
                      { id: "bank_transfer", name: "Havale/EFT", icon: "🏦" },
                    ].map((method) => (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          reservationData.paymentMethod === method.id ? "ring-2 ring-blue-700 bg-blue-50" : ""
                        }`}
                        onClick={() => setReservationData((prev) => ({ ...prev, paymentMethod: method.id }))}
                      >
                        <CardContent className="p-4 flex items-center">
                          <span className="text-2xl mr-3">{method.icon}</span>
                          <span className="font-medium">{method.name}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Confirmation */}
            {currentStep === 6 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rezervasyonunuz Alındı! 🎉</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Rezervasyonunuz başarıyla oluşturuldu. Onay e-postası gönderildi.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                  <h4 className="font-semibold mb-3">Rezervasyon Detayları</h4>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex justify-between">
                      <span>Rezervasyon No:</span>
                      <span className="font-medium">RES001234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>İşletme:</span>
                      <span className="font-medium">{business.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hizmet:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarih & Saat:</span>
                      <span className="font-medium">
                        {reservationData.date?.toLocaleDateString("tr-TR")} - {reservationData.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Toplam Tutar:</span>
                      <span className="font-medium">₺{calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={onClose} size="lg" className="bg-blue-700 hover:bg-blue-800">
                  Tamam
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Geri
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center bg-blue-700 hover:bg-blue-800"
              >
                İleri
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleReservationSubmit}
                disabled={!canProceed() || isLoading}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    İşleniyor...
                  </>
                ) : (
                  <>
                    Rezervasyonu Tamamla
                    <CheckCircle className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
