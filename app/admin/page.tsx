"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"

const mockStats = [
  { title: "Toplam Kullanıcı", value: "25,847", change: "+12%", icon: Users, color: "text-blue-600" },
  { title: "Aktif İşletme", value: "3,245", change: "+8%", icon: Building2, color: "text-green-600" },
  { title: "Bu Ay Rezervasyon", value: "18,392", change: "+15%", icon: Calendar, color: "text-purple-600" },
  { title: "Platform Geliri", value: "₺2,450,000", change: "+22%", icon: DollarSign, color: "text-yellow-600" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [pendingBusinesses, setPendingBusinesses] = useState([])
  const [users, setUsers] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [actionDialog, setActionDialog] = useState({ open: false, type: "", business: null })
  const [actionNote, setActionNote] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingBusinesses()
    } else if (activeTab === "users") {
      fetchUsers()
    } else if (activeTab === "businesses") {
      fetchBusinesses()
    } else if (activeTab === "settings") {
      fetchSettings()
    }
  }, [activeTab])

  const fetchPendingBusinesses = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/businesses/pending")
      const data = await response.json()
      if (data.success) {
        setPendingBusinesses(data.data)
      }
    } catch (error) {
      console.error("Error fetching pending businesses:", error)
      toast.error("Bekleyen başvurular yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      if (data.success) {
        setUsers(data.data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Kullanıcılar yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const fetchBusinesses = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/businesses")
      const data = await response.json()
      if (data.success) {
        setBusinesses(data.data)
      }
    } catch (error) {
      console.error("Error fetching businesses:", error)
      toast.error("İşletmeler yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Ayarlar yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleBusinessAction = async (businessId: string, action: "approve" | "reject") => {
    setLoading(true)
    try {
      const endpoint = `/api/admin/businesses/${businessId}/${action}`
      const body = action === "approve" ? { note: actionNote } : { reason: actionNote }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        fetchPendingBusinesses()
        setActionDialog({ open: false, type: "", business: null })
        setActionNote("")
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      console.error("Error handling business action:", error)
      toast.error("İşlem sırasında hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Ayarlar başarıyla kaydedildi")
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Ayarlar kaydedilirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
      case "suspended":
      case "rejected":
        return <Badge variant="destructive">Askıya Alındı</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Bekliyor</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mr-2" />
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/">
                  <Eye className="h-4 w-4 mr-2" />
                  Siteyi Görüntüle
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Sistem Ayarları
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="h-4 w-4 mr-2" />
                    Güvenlik
                  </DropdownMenuItem>
                  <DropdownMenuItem className="sm:hidden">
                    <Eye className="h-4 w-4 mr-2" />
                    Siteyi Görüntüle
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Yönetim Paneli</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Platform genelindeki tüm aktiviteleri yönetin ve denetleyin.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile Tabs */}
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white"
            >
              <option value="overview">Genel Bakış</option>
              <option value="pending">Bekleyen Başvurular</option>
              <option value="users">Kullanıcılar</option>
              <option value="businesses">İşletmeler</option>
              <option value="settings">Sistem Ayarları</option>
            </select>
          </div>

          {/* Desktop Tabs */}
          <TabsList className="hidden sm:grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="pending">Bekleyen Başvurular</TabsTrigger>
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="businesses">İşletmeler</TabsTrigger>
            <TabsTrigger value="settings">Sistem Ayarları</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {mockStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-xs sm:text-sm text-green-600 font-medium">{stat.change}</p>
                        </div>
                        <div className={`p-2 sm:p-3 rounded-full bg-gray-100 ${stat.color}`}>
                          <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
                    Bekleyen İşlemler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-yellow-50 rounded-lg gap-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">Yeni İşletme Başvuruları</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {pendingBusinesses.length} başvuru onay bekliyor
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setActiveTab("pending")}
                        className="bg-blue-700 hover:bg-blue-800 w-full sm:w-auto"
                      >
                        İncele
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                    Platform İstatistikleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base">Günlük Aktif Kullanıcı</span>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">8,432</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base">Bugünkü Rezervasyonlar</span>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base">Sistem Uptime</span>
                      <span className="font-bold text-green-600 text-sm sm:text-base">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Bekleyen İşletme Başvuruları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Yükleniyor...</div>
                ) : pendingBusinesses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Bekleyen başvuru bulunmuyor</div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {pendingBusinesses.map((business: any, index) => (
                      <motion.div
                        key={business._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="border border-yellow-200 bg-yellow-50">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col gap-4 sm:gap-6">
                              <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto sm:mx-0">
                                  <AvatarImage src={business.images?.[0] || "/placeholder.svg"} />
                                  <AvatarFallback>{business.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center sm:text-left">
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{business.name}</h3>
                                  <p className="text-gray-600 mb-2 text-sm sm:text-base">
                                    Sahibi: {business.ownerName}
                                  </p>
                                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                                    <Badge variant="outline" className="text-xs sm:text-sm">
                                      {business.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs sm:text-sm">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {business.city}
                                    </Badge>
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center justify-center sm:justify-start">
                                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      {business.phone}
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start">
                                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      {business.email}
                                    </div>
                                    <p className="text-center sm:text-left">
                                      📅 Başvuru: {new Date(business.createdAt).toLocaleDateString("tr-TR")}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2 text-center sm:text-left">
                                    Belgeler:
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="flex items-center text-xs sm:text-sm text-gray-600 justify-center sm:justify-start">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2" />
                                      İşletme Belgesi
                                    </div>
                                    <div className="flex items-center text-xs sm:text-sm text-gray-600 justify-center sm:justify-start">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2" />
                                      Vergi Levhası
                                    </div>
                                    <div className="flex items-center text-xs sm:text-sm text-gray-600 justify-center sm:justify-start">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2" />
                                      Kimlik Fotokopisi
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 flex-1"
                                    onClick={() => setActionDialog({ open: true, type: "approve", business: business })}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Onayla
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => setActionDialog({ open: true, type: "reject", business: business })}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reddet
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Detay
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Sistem Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Platform Ayarları</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm sm:text-base">Yeni Üye Kayıtları</Label>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Kullanıcıların yeni hesap oluşturmasına izin ver
                          </p>
                        </div>
                        <Switch
                          checked={settings.allowRegistration || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({ ...prev, allowRegistration: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm sm:text-base">İşletme Başvuruları</Label>
                          <p className="text-xs sm:text-sm text-gray-600">Yeni işletme başvurularını kabul et</p>
                        </div>
                        <Switch
                          checked={settings.allowBusinessApplications || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({ ...prev, allowBusinessApplications: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm sm:text-base">Bakım Modu</Label>
                          <p className="text-xs sm:text-sm text-gray-600">Siteyi bakım moduna al</p>
                        </div>
                        <Switch
                          checked={settings.maintenanceMode || false}
                          onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Bildirim Ayarları</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm sm:text-base">E-posta Bildirimleri</Label>
                          <p className="text-xs sm:text-sm text-gray-600">Sistem e-posta bildirimlerini gönder</p>
                        </div>
                        <Switch
                          checked={settings.emailNotifications || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({ ...prev, emailNotifications: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm sm:text-base">SMS Bildirimleri</Label>
                          <p className="text-xs sm:text-sm text-gray-600">SMS bildirimlerini etkinleştir</p>
                        </div>
                        <Switch
                          checked={settings.smsNotifications || false}
                          onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, smsNotifications: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-800"
                >
                  {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {actionDialog.type === "approve" ? "İşletmeyi Onayla" : "İşletmeyi Reddet"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note" className="text-sm sm:text-base">
                {actionDialog.type === "approve" ? "Onay Notu (Opsiyonel)" : "Red Sebebi (Zorunlu)"}
              </Label>
              <Textarea
                id="note"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={
                  actionDialog.type === "approve" ? "Onay ile ilgili notunuz..." : "Red sebebinizi açıklayın..."
                }
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: "", business: null })}
                className="flex-1"
              >
                İptal
              </Button>
              <Button
                onClick={() => handleBusinessAction(actionDialog.business?._id, actionDialog.type)}
                disabled={loading || (actionDialog.type === "reject" && !actionNote.trim())}
                className={`flex-1 ${actionDialog.type === "approve" ? "bg-green-600 hover:bg-green-700" : ""}`}
                variant={actionDialog.type === "reject" ? "destructive" : "default"}
              >
                {loading ? "İşleniyor..." : actionDialog.type === "approve" ? "Onayla" : "Reddet"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
