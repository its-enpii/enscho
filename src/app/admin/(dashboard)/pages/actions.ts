"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createPage(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const authorId = session ? session.split(":")[0] : null;

  await prisma.page.create({
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      authorId,
    },
  });

  revalidatePath("/admin/pages");
  // redirect("/admin/pages");
  return { success: true };
}

export async function updatePage(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const adminSession = cookieStore.get("admin_session")?.value;

  if (!session && !adminSession) {
    throw new Error("Unauthorized");
  }

  const [currentUserId, currentRole] = session
    ? session.split(":")
    : ["", "ADMIN"];
  const canManageAll =
    currentRole === "ADMIN" ||
    currentRole === "TEACHER" ||
    currentRole === "ALUMNI" ||
    !!adminSession;

  const page = await prisma.page.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!page) {
    throw new Error("Page not found");
  }

  if (!canManageAll && page.authorId !== currentUserId) {
    throw new Error("Unauthorized");
  }

  await prisma.page.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
    },
  });

  revalidatePath("/admin/pages");
  // redirect("/admin/pages");
  return { success: true };
}
