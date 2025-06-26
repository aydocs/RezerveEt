"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, Send, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "general",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Mesajınız gönderildi!",
        description: "En kısa sürede size dönüş yapacağız.",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        type: "general",
      })
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Basit responsive navbar için state
  const [navOpen, setNavOpen] = useState(false)

  // Server ve client uyumlu olarak yılı direkt hesapla
  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                aria-label="RezerveEt Anasayfa"
              >
                RezerveEt
              </Link>
              <Sparkles className="h-5 w-5 text-yellow-500 ml-1" />
            </motion.div>
            <nav className="hidden md:flex space-x-8" aria-label="Ana navigasyon">
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                İşletmeler
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Hakkımızda
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Nasıl Çalışır?
              </Link>
              <Link href="/business/register" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                İşletme Kaydı
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild className="hover:bg-blue-50">
                <Link href="/login">Giriş Yap</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/register">Üye Ol</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Contact Page Content */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">İletişim</h1>
          <p className="text-gray-600 text-lg">
            Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left side contact info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Telefon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Müşteri Hizmetleri</p>
                <p className="font-semibold text-lg">0850 123 45 67</p>
                <p className="text-sm text-gray-500 mt-2">Pazartesi - Cuma: 09:00 - 18:00</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  E-posta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Genel Sorular</p>
                <p className="font-semibold">info@rezerveet.com</p>
                <p className="text-gray-600 mb-2 mt-4">İşletme Desteği</p>
                <p className="font-semibold">business@rezerveet.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Adres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Maslak Mahallesi
                  <br />
                  Büyükdere Caddesi No:123
                  <br />
                  Sarıyer/İstanbul
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Çalışma Saatleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pazartesi - Cuma</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cumartesi</span>
                    <span>10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pazar</span>
                    <span>Kapalı</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bize Yazın</CardTitle>
                <CardDescription>
                  Formu doldurarak bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0555 123 45 67"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Konu Türü</Label>
                      <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Konu türü seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Genel Soru</SelectItem>
                          <SelectItem value="support">Teknik Destek</SelectItem>
                          <SelectItem value="business">İşletme Desteği</SelectItem>
                          <SelectItem value="complaint">Şikayet</SelectItem>
                          <SelectItem value="suggestion">Öneri</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Konu *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="Mesajınızın konusu"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mesaj *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={6}
                      required
                    />
                  </div>
<Button
  type="submit"
  className="w-full bg-blue-700 hover:bg-blue-800"
  disabled={loading}
>
  {loading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      Gönderiliyor...
    </>
  ) : (
    <>
      <Send className="h-4 w-4 mr-2" />
      Mesaj Gönder
    </>
  )}
</Button>

                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Sık Sorulan Sorular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Rezervasyon nasıl yapılır?</h4>
                    <p className="text-gray-600 text-sm">
                      İstediğiniz işletmeyi bulun, müsait tarih ve saati seçin, bilgilerinizi girin ve rezervasyonunuzu tamamlayın.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Rezervasyonumu iptal edebilir miyim?</h4>
                    <p className="text-gray-600 text-sm">
                      Evet, rezervasyon saatinden en az 2 saat önce iptal edebilirsiniz. İptal politikası işletmeye göre değişebilir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">İşletmemi nasıl kaydedebilirim?</h4>
                    <p className="text-gray-600 text-sm">
                      "İşletmemi Kaydet" butonuna tıklayarak ücretsiz hesap oluşturabilir ve işletmenizi platforma ekleyebilirsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RezerveEt
                </h3>
                <Sparkles className="h-5 w-5 text-yellow-400 ml-1" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Türkiye'nin en güvenilir ve gelişmiş online rezervasyon platformu. Milyonlarca kullanıcının tercihi.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Hızlı Linkler</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white transition-colors">
                    İşletmeler
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Destek</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Yardım Merkezi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-sm md:text-base">
              &copy;{" "}
              <a
                href="https://rezerveet.con"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 transition-colors duration-300 no-underline"
              >
                RezerveEt.com
              </a>{" "}
              all rights reserved. Made by{" "}
              <a
                href="https://emadocs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-500 transition-colors duration-300 no-underline"
              >
                EmaDocs
              </a>{" "}
              with <span className="text-purple-600" aria-label="love emoji">
                💜
              </span>{" "}
              <span className="text-purple-500 font-semibold">{year}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
