"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFeature(data: any) {
  try {
    await prisma.schoolFeature.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        order: data.order,
      },
    });
    revalidatePath("/admin/features");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to create feature:", error);
    throw new Error("Failed to create feature");
  }
}

export async function updateFeature(id: string, data: any) {
  try {
    await prisma.schoolFeature.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        order: data.order,
      },
    });
    revalidatePath("/admin/features");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to update feature:", error);
    throw new Error("Failed to update feature");
  }
}
