import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const content = formData.get("content") as string;

    await prisma.page.upsert({
      where: { slug: "akademik-landing" },
      update: { content },
      create: {
        slug: "akademik-landing",
        title: "Akademik",
        content,
      },
    });

    revalidatePath("/akademik");
    revalidatePath("/admin/akademik");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating akademik content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 }
    );
  }
}
