import { NextResponse } from "next/server"
import config from "@/lib/config"

export async function GET() {
  try {
    // Public configuration bilgileri
    const publicConfig = {
      app: {
        name: config.app.name,
        url: config.app.url,
        description: config.app.description,
      },
      features: config.features,
      social: config.social,
      version: "1.0.0",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: publicConfig,
    })
  } catch (error) {
    console.error("Config API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Configuration could not be loaded",
      },
      { status: 500 },
    )
  }
}
