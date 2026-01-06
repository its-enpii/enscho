"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveFile } from "@/lib/upload";
import { cookies } from "next/headers";

export async function createPost(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const authorId = session ? session.split(":")[0] : null;

  const imageFile = formData.get("image") as File;
  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveFile(imageFile, "posts");
  }

  await prisma.post.create({
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      published: formData.get("published") === "on",
      imageUrl,
      authorId,
    },
  });

  revalidatePath("/admin/posts");
  // redirect("/admin/posts");
  return { success: true };
}

export async function updatePost(id: string, formData: FormData) {
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

  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true, imageUrl: true },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (!canManageAll && post.authorId !== currentUserId) {
    throw new Error("Unauthorized");
  }

  const imageFile = formData.get("image") as File;
  let imageUrl = post.imageUrl || "";

  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveFile(imageFile, "posts");
  }

  await prisma.post.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      published: formData.get("published") === "on",
      imageUrl,
    },
  });

  revalidatePath("/admin/posts");
  // redirect("/admin/posts");
  return { success: true };
}
