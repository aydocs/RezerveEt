"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Grid, List, MapPin, Star, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("rating")
  const [city, setCity] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [categories, setCategories] = useState([])
  const [cities, setCities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(12)
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Fetch categories and cities on component mount
  useEffect(() => {
    fetchCategories()
    fetchCities()
    performSearch()
  }, [])

  // Perform search when filters change
  useEffect(() => {
    performSearch()
  }, [searchQuery, selectedCategories, priceRange, sortBy, city, currentPage])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchCities = async () => {
    try {
      const response = await fetch("/api/cities")
      const data = await response.json()
      if (data.success) {
        setCities(data.data)
      }
    } catch (error) {
      console.error("Error fetching cities:", error)
    }
  }

  const performSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        categories: selectedCategories.join(","),
        city: city,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        sortBy: sortBy,
        page: currentPage.toString(),
        limit: resultsPerPage.toString(),
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data.businesses)
        setTotalResults(data.data.total)
      }
    } catch (error) {
      console.error("Error performing search:", error)
    } finally {
      setLoading(false)
    }
  }

  const BusinessCard = ({ business, variant }: { business: any; variant: "grid" | "list" }) => {
    if (variant === "list") {
      return (
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="w-full sm:w-32 md:w-40 lg:w-48 flex-shrink-0">
                <Image
                  src={business.images?.[0] || "/placeholder.svg?height=120&width=120"}
                  alt={business.name}
                  width={200}
                  height={150}
                  className="w-full h-32 sm:h-24 md:h-28 lg:h-32 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 line-clamp-1">{business.name}</h3>
                    <Badge variant="outline" className="mb-2 text-xs sm:text-sm">
                      {business.category}
                    </Badge>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium text-sm sm:text-base">{business.rating}</span>
                    <span className="text-gray-500 ml-1 text-xs sm:text-sm">({business.reviewCount})</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">{business.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{business.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>{business.phone}</span>
                  </div>
                  <Badge variant={business.isOpen ? "default" : "secondary"} className="bg-blue-700 text-xs">
                    {business.isOpen ? "Açık" : "Kapalı"}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-lg font-bold text-blue-700">{business.priceRange}</span>
                  <Button asChild className="bg-blue-700 hover:bg-blue-800 w-full sm:w-auto">
                    <Link href={`/business/${business.slug}`}>Rezervasyon Yap</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="relative">
            <Image
              src={business.images?.[0] || "/placeholder.svg?height=200&width=300"}
              alt={business.name}
              width={300}
              height={200}
              className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
              <Badge variant={business.isOpen ? "default" : "secondary"} className="bg-blue-700 text-xs sm:text-sm">
                {business.isOpen ? "Açık" : "Kapalı"}
              </Badge>
            </div>
          </div>
          <div className="p-3 sm:p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1 flex-1 mr-2">{business.name}</h3>
              <div className="flex items-center flex-shrink-0">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-xs sm:text-sm font-medium">{business.rating}</span>
              </div>
            </div>
            <Badge variant="outline" className="mb-2 self-start text-xs">
              {business.category}
            </Badge>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 flex-1">{business.description}</p>
            <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-3">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{business.location}</span>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <span className="font-bold text-blue-700 text-sm sm:text-base">{business.priceRange}</span>
              <Button size="sm" asChild className="bg-blue-700 hover:bg-blue-800 text-xs sm:text-sm">
                <Link href={`/business/${business.slug}`}>Rezervasyon</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-base sm:text-lg">Kategoriler</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category: any) => (
            <div key={category.slug} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category.name])
                  } else {
                    setSelectedCategories(selectedCategories.filter((c) => c !== category.name))
                  }
                }}
              />
              <Label htmlFor={category.slug} className="text-sm flex items-center cursor-pointer">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-base sm:text-lg">Fiyat Aralığı</h3>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={50} className="mb-2" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>₺{priceRange[0]}</span>
            <span>₺{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          setSelectedCategories([])
          setPriceRange([0, 1000])
          setCity("")
          setSearchQuery("")
        }}
        variant="outline"
        className="w-full"
      >
        Filtreleri Temizle
      </Button>
    </div>
  )

  const totalPages = Math.ceil(totalResults / resultsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-700">
              RezerveEt
            </Link>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button variant="outline" asChild className="text-sm sm:text-base">
                <Link href="/login">Giriş Yap</Link>
              </Button>
              <Button asChild className="bg-blue-700 hover:bg-blue-800 text-sm sm:text-base">
                <Link href="/register">Üye Ol</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                placeholder="İşletme adı veya hizmet ara..."
                className="pl-10 sm:pl-12 h-10 sm:h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full sm:w-40 md:w-48 h-10 sm:h-12">
                <SelectValue placeholder="Şehir Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Şehirler</SelectItem>
                {cities.map((cityName: string) => (
                  <SelectItem key={cityName} value={cityName}>
                    {cityName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="lg"
              className="h-10 sm:h-12 px-6 sm:px-8 bg-blue-700 hover:bg-blue-800"
              onClick={() => setCurrentPage(1)}
              disabled={loading}
            >
              {loading ? "Aranıyor..." : "Ara"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtreler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mb-4">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtreler
                  {(selectedCategories.length > 0 || city || priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <Badge className="ml-2 bg-blue-700">
                      {selectedCategories.length + (city ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filtreler</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">İşletmeler</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {loading ? "Aranıyor..." : `${totalResults} sonuç bulundu`}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">En Yüksek Puan</SelectItem>
                    <SelectItem value="reviews">En Çok Yorum</SelectItem>
                    <SelectItem value="price-low">Fiyat: Düşük-Yüksek</SelectItem>
                    <SelectItem value="price-high">Fiyat: Yüksek-Düşük</SelectItem>
                    <SelectItem value="newest">En Yeni</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-blue-700 hover:bg-blue-800" : ""}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-blue-700 hover:bg-blue-800" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                <p className="mt-4 text-gray-600">Aranıyor...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Arama kriterlerinize uygun işletme bulunamadı.</p>
                <Button
                  onClick={() => {
                    setSelectedCategories([])
                    setPriceRange([0, 1000])
                    setCity("")
                    setSearchQuery("")
                  }}
                  className="mt-4 bg-blue-700 hover:bg-blue-800"
                >
                  Filtreleri Temizle
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                      : "space-y-4"
                  }
                >
                  {searchResults.map((business: any) => (
                    <BusinessCard key={business._id} business={business} variant={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 sm:mt-12">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        Önceki
                      </Button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className={`text-xs sm:text-sm ${currentPage === page ? "bg-blue-700 hover:bg-blue-800" : ""}`}
                            size="sm"
                          >
                            {page}
                          </Button>
                        )
                      })}
                      {totalPages > 5 && <span className="px-1 sm:px-2 text-sm">...</span>}
                      {totalPages > 5 && (
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          onClick={() => setCurrentPage(totalPages)}
                          className={`text-xs sm:text-sm ${currentPage === totalPages ? "bg-blue-700 hover:bg-blue-800" : ""}`}
                          size="sm"
                        >
                          {totalPages}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        Sonraki
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
