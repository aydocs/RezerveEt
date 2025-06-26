"use client"

import { useState } from "react"
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

const steps = [
  { id: 1, title: "İşletme Bilgileri", icon: Building2 },
  { id: 2, title: "İletişim & Adres", icon: MapPin },
  { id: 3, title: "Sahibi Bilgileri", icon: User },
  { id: 4, title: "Belgeler", icon: FileText },
  { id: 5, title: "Onay", icon: CheckCircle },
]

const categories = [
  "Restoran",
  "Kafe",
  "Kuaför",
  "Güzellik Merkezi",
  "Spor Salonu",
  "Masaj & SPA",
  "Diş Kliniği",
  "Veteriner",
  "Oto Servis",
  "Temizlik",
  "Eğitim",
  "Sağlık",
  "Diğer",
]

const cities = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Mersin",
  "Diyarbakır",
  "Kayseri",
  "Eskişehir",
]

export default function BusinessRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    // İşletme Bilgileri
    businessName: "",
    category: "",
    description: "",
    website: "",
    // İletişim & Adres
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    // Sahibi Bilgileri
    ownerName: "",
    ownerSurname: "",
    ownerPhone: "",
    ownerEmail: "",
    taxNumber: "",
    // Belgeler
    businessLicense: null as File | null,
    taxCertificate: null as File | null,
    idCopy: null as File | null,
    // Onay
    acceptTerms: false,
    acceptDataProcessing: false,
  })

  const router = useRouter()

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
      setError("")
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError("")
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.businessName || !formData.category) {
          setError("İşletme adı ve kategori zorunludur")
          return false
        }
        break
      case 2:
        if (!formData.email || !formData.phone || !formData.address || !formData.city) {
          setError("Tüm iletişim bilgileri zorunludur")
          return false
        }
        break
      case 3:
        if (!formData.ownerName || !formData.ownerSurname || !formData.ownerEmail || !formData.taxNumber) {
          setError("Tüm sahibi bilgileri zorunludur")
          return false
        }
        break
      case 4:
        if (!formData.businessLicense || !formData.taxCertificate || !formData.idCopy) {
          setError("Tüm belgeler yüklenmelidir")
          return false
        }
        break
      case 5:
        if (!formData.acceptTerms || !formData.acceptDataProcessing) {
          setError("Kullanım şartlarını ve veri işleme politikasını kabul etmelisiniz")
          return false
        }
        break
    }
    return true
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return

    setIsLoading(true)
    setError("")

    try {
      // FormData oluştur (dosya yükleme için)
      const submitData = new FormData()

      // Text alanları ekle
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitData.append(key, value)
        } else if (typeof value === "boolean") {
          submitData.append(key, value.toString())
        } else if (value) {
          submitData.append(key, value.toString())
        }
      })

      const response = await fetch("/api/businesses", {
        method: "POST",
        body: submitData,
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || "Başvuru gönderilirken bir hata oluştu")
      }
    } catch (error) {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Başvuru Alındı! 🎉</h1>
          <p className="text-gray-600 mb-6">
            İşletme başvurunuz başarıyla alındı. 24-48 saat içinde incelenecek ve size e-posta ile bilgi verilecektir.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">Giriş Sayfasına Git</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RezerveEt
              </h1>
              <Sparkles className="h-5 w-5 text-yellow-500 ml-1" />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Giriş Yap
              </Link>
              <Button variant="outline" asChild>
                <Link href="/register">Üye Ol</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">İşletme Kaydı</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İşletmenizi RezerveEt platformuna ekleyin ve rezervasyon almaya başlayın
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.id ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-400"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <step.icon className="h-6 w-6" />
              </motion.div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}>
                  Adım {step.id}
                </p>
                <p className={`text-xs ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}>{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-16 h-0.5 ml-6 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"}`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md">
          <CardContent className="p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
              >
                {/* Step 1: İşletme Bilgileri */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">İşletme Bilgileri</h2>
                      <p className="text-gray-600">İşletmenizin temel bilgilerini girin</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Label htmlFor="businessName">İşletme Adı *</Label>
                        <Input
                          id="businessName"
                          placeholder="Örn: Bella Vista Restaurant"
                          className="mt-1"
                          value={formData.businessName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Kategori *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="website">Website (Opsiyonel)</Label>
                        <Input
                          id="website"
                          placeholder="www.orneksite.com"
                          className="mt-1"
                          value={formData.website}
                          onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="description">İşletme Açıklaması</Label>
                        <Textarea
                          id="description"
                          placeholder="İşletmenizi tanıtın..."
                          className="mt-1"
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: İletişim & Adres */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">İletişim & Adres Bilgileri</h2>
                      <p className="text-gray-600">Müşterilerinizin size ulaşabileceği bilgileri girin</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">E-posta *</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="info@isletme.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefon *</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="phone"
                            placeholder="0212 123 45 67"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">Adres *</Label>
                        <Textarea
                          id="address"
                          placeholder="Tam adresinizi yazın..."
                          className="mt-1"
                          rows={3}
                          value={formData.address}
                          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">Şehir *</Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Şehir seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="district">İlçe</Label>
                        <Input
                          id="district"
                          placeholder="İlçe"
                          className="mt-1"
                          value={formData.district}
                          onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="postalCode">Posta Kodu</Label>
                        <Input
                          id="postalCode"
                          placeholder="34000"
                          className="mt-1"
                          value={formData.postalCode}
                          onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Sahibi Bilgileri */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">İşletme Sahibi Bilgileri</h2>
                      <p className="text-gray-600">İşletme sahibinin bilgilerini girin</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="ownerName">Ad *</Label>
                        <Input
                          id="ownerName"
                          placeholder="Adınız"
                          className="mt-1"
                          value={formData.ownerName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, ownerName: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="ownerSurname">Soyad *</Label>
                        <Input
                          id="ownerSurname"
                          placeholder="Soyadınız"
                          className="mt-1"
                          value={formData.ownerSurname}
                          onChange={(e) => setFormData((prev) => ({ ...prev, ownerSurname: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="ownerEmail">E-posta *</Label>
                        <Input
                          id="ownerEmail"
                          type="email"
                          placeholder="kisisel@email.com"
                          className="mt-1"
                          value={formData.ownerEmail}
                          onChange={(e) => setFormData((prev) => ({ ...prev, ownerEmail: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="ownerPhone">Telefon</Label>
                        <Input
                          id="ownerPhone"
                          placeholder="0555 123 45 67"
                          className="mt-1"
                          value={formData.ownerPhone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, ownerPhone: e.target.value }))}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="taxNumber">Vergi Numarası *</Label>
                        <Input
                          id="taxNumber"
                          placeholder="1234567890"
                          className="mt-1"
                          value={formData.taxNumber}
                          onChange={(e) => setFormData((prev) => ({ ...prev, taxNumber: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Belgeler */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerekli Belgeler</h2>
                      <p className="text-gray-600">İşletme onayı için gerekli belgeleri yükleyin</p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          key: "businessLicense",
                          title: "İşletme Belgesi",
                          description: "Ticaret odası veya belediyeden alınan işletme belgesi",
                          required: true,
                        },
                        {
                          key: "taxCertificate",
                          title: "Vergi Levhası",
                          description: "Vergi dairesinden alınan vergi levhası",
                          required: true,
                        },
                        {
                          key: "idCopy",
                          title: "Kimlik Fotokopisi",
                          description: "İşletme sahibinin kimlik kartı fotokopisi",
                          required: true,
                        },
                      ].map((doc) => (
                        <div key={doc.key} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {doc.title}
                                {doc.required && <span className="text-red-500 ml-1">*</span>}
                              </h3>
                              <p className="text-gray-600 text-sm">{doc.description}</p>
                            </div>
                            {formData[doc.key as keyof typeof formData] && (
                              <Badge className="bg-green-100 text-green-800">Yüklendi</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              id={doc.key}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById(doc.key)?.click()}
                              className="flex items-center"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Dosya Seç
                            </Button>
                            {formData[doc.key as keyof typeof formData] && (
                              <span className="text-sm text-gray-600">
                                {(formData[doc.key as keyof typeof formData] as File)?.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Dosya Gereksinimleri:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Desteklenen formatlar: PDF, JPG, JPEG, PNG</li>
                        <li>• Maksimum dosya boyutu: 5MB</li>
                        <li>• Belgeler net ve okunabilir olmalıdır</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 5: Onay */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Son Kontrol ve Onay</h2>
                      <p className="text-gray-600">Bilgilerinizi kontrol edin ve başvurunuzu tamamlayın</p>
                    </div>

                    {/* Özet */}
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Başvuru Özeti</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">İşletme Adı:</span>
                          <span className="ml-2 font-medium">{formData.businessName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Kategori:</span>
                          <span className="ml-2 font-medium">{formData.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">E-posta:</span>
                          <span className="ml-2 font-medium">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Telefon:</span>
                          <span className="ml-2 font-medium">{formData.phone}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Adres:</span>
                          <span className="ml-2 font-medium">
                            {formData.address}, {formData.district}, {formData.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Onay Checkboxları */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="acceptTerms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, acceptTerms: !!checked }))}
                        />
                        <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            Kullanım Şartları
                          </Link>
                          ,{" "}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            Gizlilik Politikası
                          </Link>{" "}
                          ve{" "}
                          <Link href="/business-terms" className="text-blue-600 hover:underline">
                            İşletme Sözleşmesi
                          </Link>
                          'ni okudum ve kabul ediyorum.
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="acceptDataProcessing"
                          checked={formData.acceptDataProcessing}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, acceptDataProcessing: !!checked }))
                          }
                        />
                        <Label htmlFor="acceptDataProcessing" className="text-sm leading-relaxed">
                          Kişisel verilerimin işlenmesine ve platform üzerinde paylaşılmasına onay veriyorum.
                        </Label>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">Önemli Bilgi:</h4>
                      <p className="text-sm text-yellow-800">
                        Başvurunuz 24-48 saat içinde incelenecektir. Onay sürecinde size e-posta ile bilgi verilecektir.
                        Eksik veya hatalı belgeler durumunda başvurunuz reddedilebilir.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>

              {currentStep < 5 ? (
                <Button type="button" onClick={nextStep} className="flex items-center">
                  İleri
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      Başvuruyu Gönder
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
