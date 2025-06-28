import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { db } = await connectToDatabase();
    const { slug } = params;

    const business = await db.collection("businesses").findOne({ slug });

    if (!business) {
      return NextResponse.json({ success: false, error: "İşletme bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: business });
  } catch (error) {
    console.error("Business GET error:", error);
    return NextResponse.json(
      { success: false, error: "İşletme bilgileri alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { db } = await connectToDatabase();
    const { slug } = params;
    const body = await request.json();

    const updateResult = await db.collection("businesses").updateOne(
      { slug },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "İşletme bulunamadı" }, { status: 404 });
    }

    const updatedBusiness = await db.collection("businesses").findOne({ slug });

    return NextResponse.json({
      success: true,
      message: "İşletme başarıyla güncellendi",
      data: updatedBusiness,
    });
  } catch (error) {
    console.error("Business PUT error:", error);
    return NextResponse.json(
      { success: false, error: "İşletme güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { db } = await connectToDatabase();
    const { slug } = params;

    const deleteResult = await db.collection("businesses").deleteOne({ slug });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "İşletme bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "İşletme başarıyla silindi",
    });
  } catch (error) {
    console.error("Business DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "İşletme silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
