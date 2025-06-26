"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Star,
  Settings,
  User,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import Link from "next/link"

const mockBusiness = {
  name: "Bella Vista Restaurant",
  category: "Restoran",
  rating: 4.8,
  reviewCount: 124,
  avatar: "/placeholder.svg?height=100&width=100",
  isVerified: true,
  totalReservations: 1250,
  monthlyRevenue: 45000,
  activeServices: 8,
  viewCount: 2340,
}

const mockReservations = [
  {
    id: 1,
    customerName: "Ayşe Kaya",
    customerPhone: "+90 555 123 45 67",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    service: "Akşam Yemeği",
    date: "2024-01-25",
    time: "19:30",
    status: "pending",
    guests: 2,
    price: 250,
    notes: "Pencere kenarı masa tercihi",
  },
  {
    id: 2,
    customerName: "Mehmet Özkan",
    customerPhone: "+90 555 987 65 43",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    service: "Öğle Yemeği",
    date: "2024-01-24",
    time: "13:00",
    status: "confirmed",
    guests: 4,
    price: 400,
    notes: "",
  },
  {
    id: 3,
    customerName: "Zeynep Demir",
    customerPhone: "+90 555 456 78 90",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    service: "Brunch",
    date: "2024-01-23",
    time: "11:00",
    status: "completed",
    guests: 2,
    price: 180,
    notes: "Doğum günü kutlaması",
  },
]

const mockServices = [
  {
    id: 1,
    name: "Akşam Yemeği",
    description: "2 kişilik romantik akşam yemeği menüsü",
    duration: 120,
    price: 250,
    isActive: true,
  },
  {
    id: 2,
    name: "Öğle Yemeği",
    description: "İş yemeği için ideal öğle menüsü",
    duration: 90,
    price: 150,
    isActive: true,
  },
  {
    id: 3,
    name: "Brunch",
    description: "Hafta sonu özel brunch menüsü",
    duration: 90,
    price: 120,
    isActive: false,
  },
]

const mockStats = [
  { title: "Bu Ay Rezervasyon", value: "156", change: "+12%", icon: Calendar, color: "text-blue-600" },
  { title: "Toplam Gelir", value: "₺45,000", change: "+8%", icon: DollarSign, color: "text-green-600" },
  { title: "Müşteri Memnuniyeti", value: "4.8", change: "+0.2", icon: Star, color: "text-yellow-600" },
  { title: "Profil Görüntüleme", value: "2,340", change: "+15%", icon: Eye, color: "text-purple-600" },
]

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [reservationFilter, setReservationFilter] = useState("all")
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Onaylandı
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Bekliyor
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tamamlandı
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            İptal Edildi
          </Badge>
        )
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
              <Button variant="outline" asChild>
                <Link href={`/business/${mockBusiness.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Profili Görüntüle
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockBusiness.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{mockBusiness.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">{mockBusiness.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    İşletme Ayarları
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profil Ayarları
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analitik
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Info Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage src={mockBusiness.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl text-blue-600">{mockBusiness.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{mockBusiness.name}</h1>
                    {mockBusiness.isVerified && <Badge className="bg-green-500 hover:bg-green-600">✓ Onaylandı</Badge>}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {mockBusiness.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold">{mockBusiness.rating}</span>
                      <span className="ml-1 opacity-80">({mockBusiness.reviewCount} yorum)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{mockBusiness.totalReservations}</div>
                      <div className="text-sm opacity-80">Toplam Rezervasyon</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">₺{mockBusiness.monthlyRevenue.toLocaleString()}</div>
                      <div className="text-sm opacity-80">Aylık Gelir</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockBusiness.activeServices}</div>
                      <div className="text-sm opacity-80">Aktif Hizmet</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockBusiness.viewCount}</div>
                      <div className="text-sm opacity-80">Profil Görüntüleme</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="reservations">Rezervasyonlar</TabsTrigger>
            <TabsTrigger value="services">Hizmetler</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                        </div>
                        <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Reservations */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">Son Rezervasyonlar</CardTitle>
                  <Button variant="outline" asChild>
                    <Link href="#reservations" onClick={() => setActiveTab("reservations")}>
                      Tümünü Gör
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReservations.slice(0, 3).map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={reservation.customerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{reservation.customerName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{reservation.customerName}</h4>
                          <p className="text-sm text-gray-600">{reservation.service}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(reservation.date).toLocaleDateString("tr-TR")} - {reservation.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(reservation.status)}
                        <span className="font-semibold text-gray-900">₺{reservation.price}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-2xl">Rezervasyon Yönetimi</CardTitle>
                  <div className="flex gap-2">
                    <Select value={reservationFilter} onValueChange={setReservationFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="pending">Bekleyen</SelectItem>
                        <SelectItem value="confirmed">Onaylanan</SelectItem>
                        <SelectItem value="completed">Tamamlanan</SelectItem>
                        <SelectItem value="cancelled">İptal Edilen</SelectItem>
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
                          <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={reservation.customerAvatar || "/placeholder.svg"} />
                                <AvatarFallback>{reservation.customerName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{reservation.customerName}</h3>
                                    <p className="text-gray-600">{reservation.service}</p>
                                    <p className="text-sm text-gray-500">{reservation.customerPhone}</p>
                                  </div>
                                  {getStatusBadge(reservation.status)}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(reservation.date).toLocaleDateString("tr-TR")}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {reservation.time}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {reservation.guests} kişi
                                  </div>
                                  <div className="flex items-center font-semibold">
                                    <DollarSign className="h-4 w-4 mr-1" />₺{reservation.price}
                                  </div>
                                </div>
                                {reservation.notes && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                    <strong>Not:</strong> {reservation.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-row lg:flex-col gap-2">
                              {reservation.status === "pending" && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Onayla
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reddet
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-1" />
                                Ara
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Mesaj
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>Detayları Görüntüle</DropdownMenuItem>
                                  <DropdownMenuItem>Rezervasyon Düzenle</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Rezervasyon İptal Et</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

          <TabsContent value="services" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">Hizmet Yönetimi</CardTitle>
                  <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Hizmet Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Yeni Hizmet Ekle</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="serviceName">Hizmet Adı</Label>
                          <Input id="serviceName" placeholder="Örn: Akşam Yemeği" />
                        </div>
                        <div>
                          <Label htmlFor="serviceDescription">Açıklama</Label>
                          <Textarea id="serviceDescription" placeholder="Hizmet açıklaması..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="serviceDuration">Süre (dakika)</Label>
                            <Input id="serviceDuration" type="number" placeholder="120" />
                          </div>
                          <div>
                            <Label htmlFor="servicePrice">Fiyat (₺)</Label>
                            <Input id="servicePrice" type="number" placeholder="250" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="serviceActive" />
                          <Label htmlFor="serviceActive">Hizmeti aktif et</Label>
                        </div>
                        <Button className="w-full">Hizmeti Kaydet</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                <Badge variant={service.isActive ? "default" : "secondary"}>
                                  {service.isActive ? "Aktif" : "Pasif"}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{service.description}</p>
                              <div className="flex gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {service.duration} dakika
                                </div>
                                <div className="flex items-center font-semibold text-gray-900">
                                  <DollarSign className="h-4 w-4 mr-1" />₺{service.price}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Düzenle
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Sil
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Rezervasyon Trendi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Grafik burada görüntülenecek</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Gelir Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Grafik burada görüntülenecek</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle>İşletme Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="businessName">İşletme Adı</Label>
                  <Input id="businessName" defaultValue={mockBusiness.name} />
                </div>
                <div>
                  <Label htmlFor="businessDescription">Açıklama</Label>
                  <Textarea id="businessDescription" placeholder="İşletmenizi tanıtın..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessPhone">Telefon</Label>
                    <Input id="businessPhone" placeholder="+90 555 123 45 67" />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">E-posta</Label>
                    <Input id="businessEmail" type="email" placeholder="info@business.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="businessAddress">Adres</Label>
                  <Textarea id="businessAddress" placeholder="İşletme adresiniz..." />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rezervasyon Ayarları</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Otomatik Onay</Label>
                      <p className="text-sm text-gray-600">Rezervasyonları otomatik olarak onayla</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Ön Ödeme Zorunluluğu</Label>
                      <p className="text-sm text-gray-600">Rezervasyon için ön ödeme iste</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Bildirimleri</Label>
                      <p className="text-sm text-gray-600">Müşterilere SMS bildirimi gönder</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Button className="w-full">Ayarları Kaydet</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
