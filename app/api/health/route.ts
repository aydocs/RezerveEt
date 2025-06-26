import { NextResponse } from "next/server"
import { checkDatabaseHealth } from "@/lib/database"
import config from "@/lib/config"

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth()

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV,
      app: config.app.name,
      database: dbHealth,
      features: {
        registration: config.features.enableRegistration,
        businessApplications: config.features.enableBusinessApplications,
        emailNotifications: config.features.enableEmailNotifications,
        maintenanceMode: config.features.maintenanceMode,
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 },
    )
  }
}
