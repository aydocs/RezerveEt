import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";

interface BusinessRequestBody {
  name: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  city: string;
  [key: string]: any;
}

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();

    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const city = url.searchParams.get("city");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.min(Number(limitParam), 100) : 20; // max 100 limit

    const query: Record<string, any> = { status: "approved" };
    if (category) query.category = category;
    if (city) query.city = city;

    const businesses = await db.collection("businesses").find(query).limit(limit).toArray();

    return NextResponse.json({ success: true, data: businesses, total: businesses.length });
  } catch (error) {
    console.error("Businesses GET error:", error);
    return NextResponse.json(
      { success: false, error: "İşletmeler alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const body: BusinessRequestBody = await request.json();

    // Zorunlu alanlar kontrolü
    const requiredFields = ["name", "category", "description", "phone", "email", "city"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} alanı zorunludur` },
          { status: 400 }
        );
      }
    }

    // Slug oluşturma
    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const now = new Date();

    const newBusiness = {
      ...body,
      slug,
      status: "pending",
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("businesses").insertOne(newBusiness);

    return NextResponse.json({
      success: true,
      message: "İşletme başvurunuz alındı, inceleme süreci başladı.",
      data: { ...newBusiness, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Businesses POST error:", error);
    return NextResponse.json(
      { success: false, error: "İşletme oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}
