"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Users,
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MessageCircle,
  Verified,
  Wifi,
  Car,
  CreditCard,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReservationWizard } from "@/components/reservation-wizard"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const mockBusiness = {
  id: 1,
  name: "Bella Vista Restaurant",
  slug: "bella-vista-restaurant",
  category: "Restoran",
  description:
    "Boğaz manzaralı eşsiz lezzetler sunan premium İtalyan restoranı. 25 yıllık deneyimimizle sizlere unutulmaz bir gastronomi deneyimi yaşatıyoruz.",
  rating: 4.8,
  reviewCount: 324,
  totalReservations: 2150,
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  location: "Kuruçeşme Cad. No:12, Beşiktaş, İstanbul",
  phone: "+90 212 555 0123",
  website: "www.bellavista.com.tr",
  email: "info@bellavista.com.tr",
  isOpen: true,
  isVerified: true,
  priceRange: "₺₺₺",
  tags: ["Deniz Manzarası", "Romantik", "İtalyan", "Fine Dining", "Özel Günler"],
  amenities: ["WiFi", "Vale Park", "Kredi Kartı", "Rezervasyon", "Canlı Müzik", "Terras"],
  workingHours: {
    monday: "12:00 - 24:00",
    tuesday: "12:00 - 24:00",
    wednesday: "12:00 - 24:00",
    thursday: "12:00 - 24:00",
    friday: "12:00 - 01:00",
    saturday: "12:00 - 01:00",
    sunday: "12:00 - 24:00",
  },
  services: [
    {
      id: 1,
      name: "Akşam Yemeği",
      description: "Premium İtalyan mutfağından özel menüler",
      duration: 120,
      price: 350,
    },
    {
      id: 2,
      name: "Öğle Yemeği",
      description: "İş yemeği için ideal seçenekler",
      duration: 90,
      price: 180,
    },
    {
      id: 3,
      name: "Brunch",
      description: "Hafta sonu özel brunch menüsü",
      duration: 120,
      price: 220,
    },
    {
      id: 4,
      name: "Özel Etkinlik",
      description: "Doğum günü, yıldönümü gibi özel günler",
      duration: 180,
      price: 500,
    },
  ],
  reviews: [
    {
      id: 1,
      userName: "Ayşe Kaya",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment: "Muhteşem bir deneyimdi! Yemekler harika, servis mükemmel, manzara eşsiz. Kesinlikle tekrar geleceğim.",
      date: "2024-01-15",
      images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    },
    {
      id: 2,
      userName: "Mehmet Özkan",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment: "Yıldönümümüzü kutladık, her şey mükemmeldi. Personel çok ilgili, yemekler lezzetli.",
      date: "2024-01-10",
      images: [],
    },
    {
      id: 3,
      userName: "Zeynep Demir",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      comment: "Güzel bir mekan, yemekler lezzetli ama biraz pahalı. Manzara gerçekten harika.",
      date: "2024-01-05",
      images: ["/placeholder.svg?height=100&width=100"],
    },
  ],
}

const amenityIcons: { [key: string]: any } = {
  WiFi: Wifi,
  "Vale Park": Car,
  "Kredi Kartı": CreditCard,
  Rezervasyon: Calendar,
  "Canlı Müzik": "🎵",
  Terras: "🌿",
}

export default function BusinessDetailPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockBusiness.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockBusiness.images.length) % mockBusiness.images.length)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockBusiness.name,
          text: mockBusiness.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link kopyalandı!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-96 bg-gray-300"></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              RezerveEt
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/login">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Üye Ol</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="relative h-96 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={mockBusiness.images[currentImageIndex] || "/placeholder.svg"}
              alt={mockBusiness.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
          onClick={prevImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mockBusiness.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 hover:bg-white"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/90 hover:bg-white" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{mockBusiness.name}</h1>
                    {mockBusiness.isVerified && (
                      <Badge className="bg-blue-600 hover:bg-blue-700">
                        <Verified className="h-3 w-3 mr-1" />
                        Onaylı
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      {mockBusiness.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-bold">{mockBusiness.rating}</span>
                      <span className="ml-1 text-gray-500">({mockBusiness.reviewCount} değerlendirme)</span>
                    </div>
                    <Badge variant="secondary">{mockBusiness.priceRange}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={mockBusiness.isOpen ? "default" : "secondary"}
                    className={mockBusiness.isOpen ? "bg-green-600" : ""}
                  >
                    {mockBusiness.isOpen ? "🟢 Açık" : "🔴 Kapalı"}
                  </Badge>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">{mockBusiness.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mockBusiness.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{mockBusiness.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{mockBusiness.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  <a href={`https://${mockBusiness.website}`} className="text-blue-600 hover:underline">
                    {mockBusiness.website}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{mockBusiness.totalReservations}+ rezervasyon</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Özellikler</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mockBusiness.amenities.map((amenity) => {
                    const IconComponent = amenityIcons[amenity]
                    return (
                      <div key={amenity} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        {typeof IconComponent === "string" ? (
                          <span className="text-lg mr-2">{IconComponent}</span>
                        ) : IconComponent ? (
                          <IconComponent className="h-5 w-5 mr-2 text-blue-600" />
                        ) : (
                          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        )}
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">Hizmetler</TabsTrigger>
                <TabsTrigger value="hours">Çalışma Saatleri</TabsTrigger>
                <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockBusiness.services.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold">{service.name}</h4>
                          <Badge className="bg-green-600">₺{service.price}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration} dakika
                          </div>
                          <Button size="sm" onClick={() => setIsReservationOpen(true)}>
                            Rezerve Et
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hours" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Çalışma Saatleri
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(mockBusiness.workingHours).map(([day, hours]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                        >
                          <span className="font-medium capitalize">
                            {day === "monday" && "Pazartesi"}
                            {day === "tuesday" && "Salı"}
                            {day === "wednesday" && "Çarşamba"}
                            {day === "thursday" && "Perşembe"}
                            {day === "friday" && "Cuma"}
                            {day === "saturday" && "Cumartesi"}
                            {day === "sunday" && "Pazar"}
                          </span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {/* Review Summary */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-3xl font-bold mr-2">{mockBusiness.rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.floor(mockBusiness.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{mockBusiness.reviewCount} değerlendirme</p>
                        </div>
                        <Button variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Değerlendirme Yaz
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {mockBusiness.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold">{review.userName}</h4>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              {review.images.length > 0 && (
                                <div className="flex space-x-2">
                                  {review.images.map((image, index) => (
                                    <Image
                                      key={index}
                                      src={image || "/placeholder.svg"}
                                      alt="Review"
                                      width={80}
                                      height={80}
                                      className="rounded-lg object-cover"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Reservation Card */}
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-center text-xl">Rezervasyon Yap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">₺{mockBusiness.services[0]?.price}</div>
                    <p className="text-sm text-gray-600">kişi başı ortalama</p>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                    onClick={() => setIsReservationOpen(true)}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Rezervasyon Yap
                  </Button>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Shield className="h-4 w-4 mr-1" />
                    Güvenli rezervasyon
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hızlı Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kategori</span>
                    <Badge variant="outline">{mockBusiness.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fiyat Aralığı</span>
                    <span className="font-medium">{mockBusiness.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Durum</span>
                    <Badge
                      variant={mockBusiness.isOpen ? "default" : "secondary"}
                      className={mockBusiness.isOpen ? "bg-green-600" : ""}
                    >
                      {mockBusiness.isOpen ? "Açık" : "Kapalı"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Toplam Rezervasyon</span>
                    <span className="font-medium">{mockBusiness.totalReservations}+</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">İletişim</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={`tel:${mockBusiness.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Ara
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={`https://${mockBusiness.website}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Yol Tarifi
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Wizard */}
      <ReservationWizard
        business={mockBusiness}
        services={mockBusiness.services}
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </div>
  )
}
