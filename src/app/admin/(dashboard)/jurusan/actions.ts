"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveFile, deleteFile } from "@/lib/upload";
import { cookies } from "next/headers";

export async function createMajor(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const authorId = session ? session.split(":")[0] : null;

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;
  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveFile(imageFile, "jurusan");
  }

  const content = formData.get("content") as string;
  const careerProspects = formData.get("careerProspects") as string;
  const competencies = formData.get("competencies") as string;

  try {
    await prisma.major.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        content,
        careerProspects,
        competencies,
        authorId,
      } as any,
    });

    revalidatePath("/", "layout"); // Revalidate global layout
    revalidatePath("/admin/jurusan");
    return { success: true };
  } catch (error) {
    console.error("Error creating major:", error);
    return { error: "Gagal menyimpan jurusan" };
  }
}

export async function updateMajor(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const adminSession = cookieStore.get("admin_session")?.value;

  if (!session && !adminSession) {
    return { error: "Unauthorized" };
  }

  const [currentUserId, currentRole] = session
    ? session.split(":")
    : ["", "ADMIN"];
  const canManageAll =
    currentRole === "ADMIN" ||
    currentRole === "TEACHER" ||
    currentRole === "ALUMNI" ||
    !!adminSession;

  const major = await prisma.major.findUnique({
    where: { id },
    select: { authorId: true, imageUrl: true },
  });

  if (!major) {
    return { error: "Jurusan tidak ditemukan" };
  }

  if (!canManageAll && major.authorId !== currentUserId) {
    return { error: "Unauthorized" };
  }

  const imageFile = formData.get("image") as File;
  let imageUrl = major.imageUrl || "";

  if (imageFile && imageFile.size > 0) {
    // Delete old image if exists
    if (major.imageUrl) {
      await deleteFile(major.imageUrl);
    }
    imageUrl = await saveFile(imageFile, "jurusan");
  }

  try {
    await prisma.major.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        imageUrl,
        content: formData.get("content") as string,
        careerProspects: formData.get("careerProspects") as string,
        competencies: formData.get("competencies") as string,
      } as any,
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/jurusan");
    return { success: true };
  } catch (error) {
    console.error("Error updating major:", error);
    return { error: "Gagal memperbarui jurusan" };
  }
}
