"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAkademikContent(formData: FormData) {
  const content = formData.get("content") as string;
  const slug = "akademik-landing";

  // Upsert the page content
  await prisma.page.upsert({
    where: { slug },
    update: { 
      content,
      title: "Program Unggulan Akademik" // Ensure title is set
    },
    create: {
      slug,
      title: "Program Unggulan Akademik",
      content,
    }
  });

  revalidatePath("/akademik");
  revalidatePath("/admin/akademik");
}

