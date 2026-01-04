"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePageContent(formData: FormData) {
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const title = formData.get("title") as string;

  await prisma.page.upsert({
    where: { slug },
    update: { 
      content,
      title
    },
    create: {
      slug,
      title,
      content
    }
  });

  revalidatePath(`/akademik/${slug}`);
  revalidatePath(`/admin/akademik/pages/${slug}`);
}
