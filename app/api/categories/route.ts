import { NextResponse } from "next/server"

// Mock data for categories - production'da database'den gelecek
const categories = [
  {
    id: 1,
    name: "Restoran",
    slug: "restoran",
    icon: "🍽️",
    description: "Yemek ve içecek hizmetleri",
    count: 1250,
    featured: true,
  },
  {
    id: 2,
    name: "Kuaför",
    slug: "kuafor",
    icon: "✂️",
    description: "Saç bakım ve güzellik hizmetleri",
    count: 850,
    featured: true,
  },
  {
    id: 3,
    name: "Spor Salonu",
    slug: "spor-salonu",
    icon: "💪",
    description: "Fitness ve spor aktiviteleri",
    count: 420,
    featured: true,
  },
  {
    id: 4,
    name: "Kafe",
    slug: "kafe",
    icon: "☕",
    description: "Kahve ve hafif yiyecekler",
    count: 680,
    featured: true,
  },
  {
    id: 5,
    name: "Güzellik Merkezi",
    slug: "guzellik-merkezi",
    icon: "💄",
    description: "Cilt bakımı ve estetik hizmetler",
    count: 320,
    featured: false,
  },
  {
    id: 6,
    name: "Masaj Salonu",
    slug: "masaj-salonu",
    icon: "💆",
    description: "Rahatlama ve terapi hizmetleri",
    count: 180,
    featured: false,
  },
  {
    id: 7,
    name: "Veteriner",
    slug: "veteriner",
    icon: "🐕",
    description: "Evcil hayvan sağlık hizmetleri",
    count: 95,
    featured: false,
  },
  {
    id: 8,
    name: "Diş Kliniği",
    slug: "dis-klinigi",
    icon: "🦷",
    description: "Diş sağlığı ve tedavi hizmetleri",
    count: 240,
    featured: false,
  },
  {
    id: 9,
    name: "Berber",
    slug: "berber",
    icon: "💈",
    description: "Erkek kuaför hizmetleri",
    count: 450,
    featured: false,
  },
  {
    id: 10,
    name: "Oto Servis",
    slug: "oto-servis",
    icon: "🚗",
    description: "Araç bakım ve onarım hizmetleri",
    count: 380,
    featured: false,
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")

    let filteredCategories = categories

    if (featured === "true") {
      filteredCategories = categories.filter((cat) => cat.featured)
    }

    if (limit) {
      filteredCategories = filteredCategories.slice(0, Number.parseInt(limit))
    }

    return NextResponse.json({
      success: true,
      data: filteredCategories,
      total: filteredCategories.length,
    })
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Kategoriler yüklenirken hata oluştu",
      },
      { status: 500 },
    )
  }
}
