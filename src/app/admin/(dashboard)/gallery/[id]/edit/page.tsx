import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GalleryForm from "../../_components/GalleryForm";
import { notFound } from "next/navigation";
import { writeFile, unlink } from "fs/promises";
import path from "path";

import { cookies } from "next/headers";

async function updateGalleryItem(id: string, formData: FormData) {
  "use server";

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

  // Verify ownership or admin status
  const itemToUpdate = await prisma.gallery.findUnique({
    where: { id },
    select: { authorId: true, imageUrl: true },
  });

  if (!itemToUpdate) throw new Error("Item not found");
  if (!canManageAll && itemToUpdate.authorId !== currentUserId) {
    throw new Error("You do not have permission to edit this item");
  }

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as File | null;

  let imageUrl: string | undefined;

  // If new image uploaded
  if (image && image.size > 0) {
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = image.name.replace(/\s+/g, "-");
    const filename = `${timestamp}-${originalName}`;

    // Save new file
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    imageUrl = `/uploads/gallery/${filename}`;

    // Delete old file if exists and is local
    if (
      itemToUpdate.imageUrl &&
      itemToUpdate.imageUrl.startsWith("/uploads/")
    ) {
      try {
        const oldFilepath = path.join(
          process.cwd(),
          "public",
          itemToUpdate.imageUrl
        );
        await unlink(oldFilepath);
      } catch (error) {
        console.error("Failed to delete old image:", error);
      }
    }
  }

  await prisma.gallery.update({
    where: { id },
    data: {
      title,
      category,
      ...(imageUrl && { imageUrl }),
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery");
  // redirect("/admin/gallery");
  return { success: true };
}

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.gallery.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={20} />
          Kembali ke Galeri
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Foto</h1>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui informasi foto galeri
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <GalleryForm
          action={updateGalleryItem.bind(null, id)}
          initialData={item as any}
        />
      </div>
    </div>
  );
}
