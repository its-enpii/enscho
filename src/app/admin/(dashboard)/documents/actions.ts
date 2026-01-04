"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveFile } from "@/lib/upload";

export async function createDocument(formData: FormData) {
  const file = formData.get("file") as File;
  let fileUrl = "";
  let size = "0 KB";

  if (file && file.size > 0) {
    fileUrl = await saveFile(file, "documents");
    // Calculate size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB >= 1) {
      size = `${sizeInMB.toFixed(1)} MB`;
    } else {
      size = `${(file.size / 1024).toFixed(0)} KB`;
    }
  } else {
      // Allow manual URL entry if needed, or error
      // taking simple approach: file is required for new doc unless url provided manually?
      // Let's assume file upload for now.
      return { success: false, error: "File is required" };
  }

  await prisma.document.create({
    data: {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      fileUrl,
      size,
    }
  });

  revalidatePath("/admin/documents");
  revalidatePath("/akademik");
}

export async function deleteDocument(id: string) {
  try {
    await prisma.document.delete({
      where: { id }
    });
    revalidatePath("/admin/documents");
    revalidatePath("/akademik");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete" };
  }
}
