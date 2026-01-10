"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveFile, deleteFile } from "@/lib/upload";

export async function deletePartner(id: string) {
  try {
    await prisma.partner.delete({
      where: { id },
    });
    revalidatePath("/admin/mitra");
    revalidatePath("/hubin/mitra"); // Revalidate public page
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete item" };
  }
}

export async function createPartner(formData: FormData) {
  const imageFile = formData.get("image") as File;
  let logoUrl = "";

  if (imageFile && imageFile.size > 0) {
    logoUrl = await saveFile(imageFile, "partners");
  }

  await prisma.partner.create({
    data: {
      name: formData.get("name") as string,
      website: formData.get("website") as string,
      logoUrl,
    },
  });

  revalidatePath("/admin/mitra");
  revalidatePath("/hubin/mitra");
  // redirect("/admin/mitra");
  return { success: true };
}

export async function updatePartner(id: string, formData: FormData) {
  const imageFile = formData.get("image") as File;

  const currentPartner = await prisma.partner.findUnique({ where: { id } });
  if (!currentPartner) throw new Error("Partner not found");

  let logoUrl = currentPartner.logoUrl;

  if (imageFile && imageFile.size > 0) {
    // Delete old logo if exists
    if (currentPartner.logoUrl) {
      await deleteFile(currentPartner.logoUrl);
    }
    logoUrl = await saveFile(imageFile, "partners");
  }

  await prisma.partner.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      website: formData.get("website") as string,
      logoUrl,
    },
  });

  revalidatePath("/admin/mitra");
  revalidatePath("/hubin/mitra");
  // redirect("/admin/mitra");
  return { success: true };
}
