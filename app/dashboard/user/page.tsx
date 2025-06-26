"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Settings,
  User,
  Heart,
  CreditCard,
  Bell,
  LogOut,
  Filter,
  Search,
  MoreHorizontal,
  Phone,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const mockUser = {
  name: "Ayşe Kaya",
  email: "ayse.kaya@email.com",
  phone: "+90 555 123 45 67",
  avatar: "/placeholder.svg?height=100&width=100",
  memberSince: "Ocak 2023",
  totalReservations: 24,
  favoriteBusinesses: 8,
  points: 1250,
}

const mockReservations = [
  {
    id: 1,
    businessName: "Bella Vista Restaurant",
    businessImage: "/placeholder.svg?height=80&width=80",
    service: "Akşam Yemeği",
    date: "2024-01-25",
    time: "19:30",
    status: "confirmed",
    price: 250,
    guests: 2,
    businessSlug: "bella-vista-restaurant",
  },
  {
    id: 2,
    businessName: "Style Hair Studio",
    businessImage: "/placeholder.svg?height=80&width=80",
    service: "Saç Kesimi & Styling",
    date: "2024-01-20",
    time: "14:00",
    status: "completed",
    price: 180,
    guests: 1,
    businessSlug: "style-hair-studio",
    canReview: true,
  },
  {
    id: 3,
    businessName: "FitZone Gym",
    businessImage: "/placeholder.svg?height=80&width=80",
    service: "Kişisel Antrenman",
    date: "2024-01-18",
    time: "10:00",
    status: "cancelled",
    price: 120,
    guests: 1,
    businessSlug: "fitzone-gym",
  },
  {
    id: 4,
    businessName: "Aroma Coffee House",
    businessImage: "/placeholder.svg?height=80&width=80",
    service: "Masa Rezervasyonu",
    date: "2024-01-15",
    time: "16:00",
    status: "completed",
    price: 0,
    guests: 3,
    businessSlug: "aroma-coffee-house",
    canReview: true,
  },
]

const mockFavorites = [
  {
    id: 1,
    name: "Bella Vista Restaurant",
    category: "Restoran",
    rating: 4.8,
    image: "/placeholder.svg?height=120&width=120",
    location: "Kadıköy, İstanbul",
    slug: "bella-vista-restaurant",
  },
  {
    id: 2,
    name: "Style Hair Studio",
    category: "Kuaför",
    rating: 4.9,
    image: "/placeholder.svg?height=120&width=120",
    location: "Beşiktaş, İstanbul",
    slug: "style-hair-studio",
  },
]

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("reservations")
  const [reservationFilter, setReservationFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">✓ Onaylandı</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">⏳ Bekliyor</Badge>
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">✅ Tamamlandı</Badge>
      case "cancelled":
        return <Badge variant="destructive">❌ İptal Edildi</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredReservations = mockReservations.filter((reservation) => {
    if (reservationFilter === "all") return true
    return reservation.status === reservationFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              RezerveEt
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">{mockUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profil Ayarları
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Hesap Ayarları
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">{mockUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-gray-900">{mockUser.name}</h2>
                  <p className="text-gray-600">{mockUser.email}</p>
                  <Badge variant="outline" className="mt-2">
                    Üye: {mockUser.memberSince}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{mockUser.points}</div>
                      <div className="text-sm text-gray-600">RezerveEt Puanı</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{mockUser.totalReservations}</div>
                      <div className="text-xs text-gray-600">Rezervasyon</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{mockUser.favoriteBusinesses}</div>
                      <div className="text-xs text-gray-600">Favori</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/user/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profil Ayarları
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/user/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Hesap Ayarları
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/user/payment">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Ödeme Yöntemleri
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz, {mockUser.name.split(" ")[0]}! 👋</h1>
              <p className="text-gray-600">Rezervasyonlarınızı yönetin ve yeni deneyimler keşfedin.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
                <TabsTrigger value="reservations" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Rezervasyonlar
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoriler
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Yorumlarım
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reservations" className="space-y-6">
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <CardTitle className="text-2xl">Rezervasyonlarım</CardTitle>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Rezervasyon ara..."
                            className="pl-10 w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Select value={reservationFilter} onValueChange={setReservationFilter}>
                          <SelectTrigger className="w-full sm:w-40">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="confirmed">Onaylandı</SelectItem>
                            <SelectItem value="pending">Bekliyor</SelectItem>
                            <SelectItem value="completed">Tamamlandı</SelectItem>
                            <SelectItem value="cancelled">İptal Edildi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredReservations.map((reservation, index) => (
                        <motion.div
                          key={reservation.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <Image
                                  src={reservation.businessImage || "/placeholder.svg"}
                                  alt={reservation.businessName}
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover mx-auto sm:mx-0"
                                />
                                <div className="flex-1 space-y-2">
                                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900">
                                        {reservation.businessName}
                                      </h3>
                                      <p className="text-gray-600">{reservation.service}</p>
                                    </div>
                                    {getStatusBadge(reservation.status)}
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {new Date(reservation.date).toLocaleDateString("tr-TR")}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {reservation.time}
                                    </div>
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 mr-1" />
                                      {reservation.guests} kişi
                                    </div>
                                    {reservation.price > 0 && (
                                      <div className="flex items-center font-semibold">
                                        <CreditCard className="h-4 w-4 mr-1" />₺{reservation.price}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`/business/${reservation.businessSlug}`}>Detayları Gör</Link>
                                    </Button>
                                    {reservation.status === "confirmed" && (
                                      <>
                                        <Button variant="outline" size="sm">
                                          <Phone className="h-4 w-4 mr-1" />
                                          Ara
                                        </Button>
                                        <Button variant="outline" size="sm">
                                          <MessageSquare className="h-4 w-4 mr-1" />
                                          Mesaj
                                        </Button>
                                      </>
                                    )}
                                    {reservation.canReview && (
                                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                                        <Star className="h-4 w-4 mr-1" />
                                        Yorum Yap
                                      </Button>
                                    )}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem>Rezervasyon Detayı</DropdownMenuItem>
                                        <DropdownMenuItem>Favorilere Ekle</DropdownMenuItem>
                                        {reservation.status === "confirmed" && (
                                          <DropdownMenuItem className="text-red-600">İptal Et</DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-6">
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl">Favori İşletmelerim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockFavorites.map((business, index) => (
                        <motion.div
                          key={business.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex gap-4">
                                <Image
                                  src={business.image || "/placeholder.svg"}
                                  alt={business.name}
                                  width={120}
                                  height={120}
                                  className="rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                                      <Badge variant="outline" className="mb-2">
                                        {business.category}
                                      </Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500">
                                      <Heart className="h-5 w-5 fill-current" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center mb-3">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                    <span className="text-sm font-medium">{business.rating}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600 text-sm mb-4">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {business.location}
                                  </div>
                                  <Button className="w-full" asChild>
                                    <Link href={`/business/${business.slug}`}>Rezervasyon Yap</Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl">Yorumlarım</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz yorum yapmadınız</h3>
                      <p className="text-gray-600 mb-6">
                        Deneyimlerinizi paylaşın ve diğer kullanıcılara yardımcı olun.
                      </p>
                      <Button asChild>
                        <Link href="/search">İşletmeleri Keşfet</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
