import { type NextRequest, NextResponse } from "next/server"
import { SearchService } from "@/lib/search-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const suggestions = await SearchService.getSuggestions(query)

    return NextResponse.json({
      success: true,
      data: suggestions,
    })
  } catch (error) {
    console.error("Search suggestions API error:", error)
    return NextResponse.json({ success: false, error: "Öneriler yüklenirken hata oluştu" }, { status: 500 })
  }
}
