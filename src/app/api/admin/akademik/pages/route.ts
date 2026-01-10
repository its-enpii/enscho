import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const title = formData.get("title") as string;

    await prisma.page.upsert({
      where: { slug },
      update: {
        content,
        title,
      },
      create: {
        slug,
        title,
        content,
      },
    });

    revalidatePath(`/akademik/${slug}`);
    revalidatePath(`/admin/akademik/pages/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update page" },
      { status: 500 }
    );
  }
}
