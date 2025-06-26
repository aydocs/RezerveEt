import { Star, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface BusinessCardProps {
  business: {
    id: number
    name: string
    category: string
    rating: number
    reviewCount: number
    image: string
    location: string
    isOpen: boolean
    slug: string
    description?: string
    phone?: string
    priceRange?: string
  }
  variant?: "grid" | "list"
  isLoading?: boolean
}

export function BusinessCard({ business, variant = "grid", isLoading = false }: BusinessCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <div className="relative">
          <div className="bg-gray-200 w-full h-48"></div>
        </div>
        <CardContent className="p-4">
          <div className="bg-gray-200 h-4 w-1/2 mb-2"></div>
          <div className="bg-gray-200 h-6 w-3/4 mb-2"></div>
          <div className="bg-gray-200 h-4 w-full mb-4"></div>
          <div className="bg-gray-200 h-10 w-full"></div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="flex md:flex-row flex-col">
          <div className="relative w-full md:w-48 h-32 flex-shrink-0">
            <Image src={business.image || "/placeholder.svg"} alt={business.name} fill className="object-cover" />
            <div className="absolute top-2 right-2">
              <Badge
                variant={business.isOpen ? "default" : "secondary"}
                className={business.isOpen ? "bg-green-600" : ""}
              >
                {business.isOpen ? "Açık" : "Kapalı"}
              </Badge>
            </div>
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{business.category}</Badge>
                  {business.priceRange && <span className="text-sm text-gray-500">{business.priceRange}</span>}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{business.name}</h3>
                {business.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{business.description}</p>
                )}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{business.rating}</span>
                <span className="ml-1 text-sm text-gray-500">({business.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {business.location}
              </div>
              <div className="flex gap-2">
                {business.phone && (
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Ara
                  </Button>
                )}
                <Button size="sm" asChild className="bg-blue-700 hover:bg-blue-800">
                  <Link href={`/business/${business.slug}`}>Rezervasyon</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className="relative">
        <Image
          src={business.image || "/placeholder.svg"}
          alt={business.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={business.isOpen ? "default" : "secondary"} className={business.isOpen ? "bg-green-600" : ""}>
            {business.isOpen ? "Açık" : "Kapalı"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{business.category}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{business.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({business.reviewCount})</span>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{business.name}</h3>
        {business.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{business.description}</p>}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {business.location}
        </div>
        <Button className="w-full bg-blue-700 hover:bg-blue-800" asChild>
          <Link href={`/business/${business.slug}`}>Detay & Rezervasyon</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
