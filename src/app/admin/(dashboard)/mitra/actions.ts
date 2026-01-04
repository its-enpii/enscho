"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePartner(id: string) {
  try {
    await prisma.partner.delete({
      where: { id }
    });
    revalidatePath("/admin/mitra");
    revalidatePath("/hubin/mitra"); // Revalidate public page
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete item" };
  }
}
