"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  Utensils,
  Scissors,
  Dumbbell,
  Coffee,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const categories = [
  { name: "Restoran", icon: Utensils, color: "bg-gradient-to-br from-orange-500 to-red-500", count: "1,200+" },
  { name: "Kuaför", icon: Scissors, color: "bg-gradient-to-br from-pink-500 to-purple-500", count: "850+" },
  { name: "Spor Salonu", icon: Dumbbell, color: "bg-gradient-to-br from-blue-500 to-cyan-500", count: "420+" },
  { name: "Kafe", icon: Coffee, color: "bg-gradient-to-br from-amber-500 to-orange-500", count: "680+" },
]

const featuredBusinesses = [
  {
    id: 1,
    name: "Bella Vista Restaurant",
    category: "Restoran",
    rating: 4.8,
    reviewCount: 124,
    image: "/placeholder.svg?height=300&width=400",
    location: "Kadıköy, İstanbul",
    isOpen: true,
    slug: "bella-vista-restaurant",
    priceRange: "₺₺₺",
    tags: ["Deniz Manzarası", "Romantik", "İtalyan"],
    discount: 15,
  },
  {
    id: 2,
    name: "Style Hair Studio",
    category: "Kuaför",
    rating: 4.9,
    reviewCount: 89,
    image: "/placeholder.svg?height=300&width=400",
    location: "Beşiktaş, İstanbul",
    isOpen: true,
    slug: "style-hair-studio",
    priceRange: "₺₺",
    tags: ["Unisex", "Modern", "Uzman Ekip"],
    discount: 20,
  },
  {
    id: 3,
    name: "FitZone Gym",
    category: "Spor Salonu",
    rating: 4.7,
    reviewCount: 156,
    image: "/placeholder.svg?height=300&width=400",
    location: "Şişli, İstanbul",
    isOpen: false,
    slug: "fitzone-gym",
    priceRange: "₺₺",
    tags: ["24/7", "Modern Ekipman", "Kişisel Antrenör"],
  },
  {
    id: 4,
    name: "Aroma Coffee House",
    category: "Kafe",
    rating: 4.6,
    reviewCount: 78,
    image: "/placeholder.svg?height=300&width=400",
    location: "Beyoğlu, İstanbul",
    isOpen: true,
    slug: "aroma-coffee-house",
    priceRange: "₺",
    tags: ["Özel Kahve", "WiFi", "Çalışma Alanı"],
    discount: 10,
  },
]

const testimonials = [
  {
    name: "Ayşe Kaya",
    role: "Müşteri",
    content: "RezerveEt sayesinde favori restoranımda masa bulmak artık çok kolay. Harika bir platform!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Mehmet Özkan",
    role: "İşletme Sahibi",
    content: "Rezervasyon yönetimi hiç bu kadar kolay olmamıştı. Müşteri memnuniyetimiz %40 arttı.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Zeynep Demir",
    role: "Kuaför Salonu",
    content: "Dijital dönüşümümüzü RezerveEt ile tamamladık. Artık randevularımızı çok daha iyi yönetiyoruz.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    if (searchQuery || selectedCategory || selectedCity) {
      const query = `?q=${searchQuery}&category=${selectedCategory}&city=${selectedCity}`
      router.push(`/search${query}`)
    } else {
      router.push("/search")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                RezerveEt
              </Link>
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 ml-1" />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                İşletmeler
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Hakkımızda
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Nasıl Çalışır?
              </Link>
              <Link
                href="/business/register"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                İşletme Kaydı
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                İletişim
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t bg-white"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    href="/search"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    İşletmeler
                  </Link>
                  <Link
                    href="/about"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hakkımızda
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Nasıl Çalışır?
                  </Link>
                  <Link
                    href="/business/register"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    İşletme Kaydı
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    İletişim
                  </Link>
                  <div className="flex flex-col space-y-2 px-3 pt-4 border-t">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Giriş Yap
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-blue-700 hover:bg-blue-800">
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Üye Ol
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Rezervasyonunuzu{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Kolayca
              </span>{" "}
              Yapın
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed px-4">
              Türkiye'nin en gelişmiş rezervasyon platformu ile restoran, kuaför, spor salonu ve daha fazlası için
              anında rezervasyon yapın
            </p>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div
            className="max-w-6xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-3 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    placeholder="İşletme adı, hizmet veya konum ara..."
                    className="pl-10 sm:pl-12 h-12 sm:h-14 text-gray-900 border-0 bg-gray-50 focus:bg-white transition-colors text-sm sm:text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-48 xl:w-56 h-12 sm:h-14 border-0 bg-blue-700 text-white">
                    <SelectValue placeholder="Kategori Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌐 Tüm Kategoriler</SelectItem>
                    <SelectItem value="restaurant">🍽️ Restoran</SelectItem>
                    <SelectItem value="salon">✂️ Kuaför</SelectItem>
                    <SelectItem value="gym">💪 Spor Salonu</SelectItem>
                    <SelectItem value="cafe">☕ Kafe</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full lg:w-48 xl:w-56 h-12 sm:h-14 border-0 bg-blue-700 text-white">
                    <SelectValue placeholder="Şehir Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="istanbul">📍 İstanbul</SelectItem>
                    <SelectItem value="ankara">📍 Ankara</SelectItem>
                    <SelectItem value="izmir">📍 İzmir</SelectItem>
                    <SelectItem value="bursa">📍 Bursa</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="lg"
                  className="h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-lg font-semibold"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Ara
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer text-xs sm:text-sm"
                >
                  🔥 Popüler: Restoran
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer text-xs sm:text-sm"
                >
                  ✨ Yeni: Güzellik Merkezi
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer text-xs sm:text-sm"
                >
                  💪 Trend: Spor Salonu
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-8 sm:mt-12 text-blue-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Güvenli Ödeme</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Anında Onay</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm">4.9/5 Memnuniyet</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Popüler Kategoriler</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun hizmeti bulun ve anında rezervasyon yapın
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeInOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="cursor-pointer"
              >
                <Link href="/search">
                  <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden group h-full">
                    <CardContent className="p-4 sm:p-6 lg:p-8 text-center relative h-full flex flex-col justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div
                        className={`${category.color} w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                      >
                        <category.icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-gray-600 font-medium text-sm sm:text-base">{category.count} İşletme</p>
                      <div className="mt-3 sm:mt-4 flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700">
                        <span className="text-xs sm:text-sm">Keşfet</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Öne Çıkan İşletmeler</h2>
              <p className="text-lg sm:text-xl text-gray-600">En popüler ve kaliteli işletmeleri keşfedin</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex hover:bg-blue-50 border-blue-200">
              <Link href="/search">
                Tümünü Gör
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featuredBusinesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeInOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white h-full">
                  <div className="relative">
                    <Image
                      src={business.image || "/placeholder.svg"}
                      alt={business.name}
                      width={400}
                      height={300}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <Badge
                        variant="default"
                        className={`shadow-lg text-white font-semibold text-xs sm:text-sm
                            ${business.isOpen ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                          `}
                      >
                        {business.isOpen ? "🟢 Açık" : "🔴 Kapalı"}
                      </Badge>
                    </div>
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900 shadow-lg text-xs sm:text-sm">
                        {business.priceRange}
                      </Badge>
                    </div>
                    {business.discount && (
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                        <Badge className="bg-red-500 hover:bg-red-600 shadow-lg text-xs sm:text-sm">
                          %{business.discount} İndirim
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 text-xs sm:text-sm">
                        {business.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-xs sm:text-sm font-bold">{business.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({business.reviewCount})</span>
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {business.name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-4">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{business.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {business.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
                        asChild
                      >
                        <Link href={`/business/${business.slug}`}>
                          Detay & Rezervasyon
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mobile Show All Button */}
          <div className="flex justify-center mt-8 sm:hidden">
            <Button variant="outline" asChild className="hover:bg-blue-50 border-blue-200">
              <Link href="/search">
                Tümünü Gör
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              3 basit adımda rezervasyonunuzu tamamlayın
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "1",
                title: "Ara & Keşfet",
                description:
                  "İstediğiniz hizmeti sunan işletmeleri kolayca bulun ve karşılaştırın. Filtreler ile aradığınızı hızlıca bulun.",
                icon: Search,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "2",
                title: "Tarih & Saat Seç",
                description:
                  "Gerçek zamanlı uygunluk kontrolü ile size en uygun tarih ve saati seçin. Anında onay alın.",
                icon: Clock,
                color: "from-green-500 to-emerald-500",
              },
              {
                step: "3",
                title: "Rezerve Et & Keyfini Çıkar",
                description: "Güvenli ödeme ile rezervasyonunuzu tamamlayın. SMS ve e-posta ile bildirim alın.",
                icon: Users,
                color: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-6 sm:mb-8">
                  <div
                    className={`bg-gradient-to-br ${item.color} w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-xl`}
                  >
                    <item.icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg border-2 border-gray-100">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Müşterilerimiz Ne Diyor?</h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Binlerce mutlu müşteri ve işletme sahibinin deneyimleri
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                    <div className="flex justify-center mb-4 sm:mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-lg sm:text-xl lg:text-2xl font-medium mb-6 sm:mb-8 leading-relaxed">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Image
                        src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                        alt={testimonials[currentTestimonial].name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="text-center sm:text-left">
                        <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                        <div className="text-blue-200">{testimonials[currentTestimonial].role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-white" : "bg-white/30"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { number: "3,200+", label: "Kayıtlı İşletme", icon: "🏢" },
              { number: "125,000+", label: "Mutlu Müşteri", icon: "😊" },
              { number: "500,000+", label: "Tamamlanan Rezervasyon", icon: "✅" },
              { number: "25", label: "Şehir", icon: "🌍" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Hemen Başlayın!</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Rezervasyon yapmak hiç bu kadar kolay olmamıştı. Şimdi üye olun ve avantajları keşfedin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg px-6 sm:px-8 h-12 sm:h-14"
                asChild
              >
                <Link href="/register">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Ücretsiz Üye Ol
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white bg-blue-700 border-transparent text-lg px-6 sm:px-8 h-12 sm:h-14 hover:bg-white hover:text-gray-900"
                asChild
              >
                <Link href="/business/register">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  İşletme Kaydı
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center mb-4">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RezerveEt
                </h3>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 ml-1" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed text-sm sm:text-base">
                Türkiye'nin en güvenilir ve gelişmiş online rezervasyon platformu. Milyonlarca kullanıcının tercihi.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
                  📱
                </Button>
                <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
                  📧
                </Button>
                <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
                  🐦
                </Button>
                <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
                  📘
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Hızlı Linkler</h4>
              <ul className="space-y-3 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="/search" className="hover:text-white transition-colors">
                    İşletmeler
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    Nasıl Çalışır?
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
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Destek</h4>
              <ul className="space-y-3 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Yardım Merkezi
                  </Link>
                </li>
                <li>
                  <Link href="/business/help" className="hover:text-white transition-colors">
                    İşletme Desteği
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Güvenlik
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm md:text-base">
              &copy;{" "}
              <a
                href="https://rezerveet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 transition-colors duration-300 no-underline"
              >
                RezerveEt.com{" "}
              </a>{" "}
              All rights reserved. Made by{" "}
              <a
                href="https://emadocs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-500 transition-colors duration-300 no-underline"
              >
                EmaDocs
              </a>{" "}
              with <span className="text-purple-600">💜</span>{" "}
              <span className="text-purple-500 font-semibold">{new Date().getFullYear()}</span>{" "}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
