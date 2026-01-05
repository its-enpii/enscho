import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GalleryForm from "../../_components/GalleryForm";
import { notFound } from "next/navigation";
import { writeFile, unlink } from "fs/promises";
import path from "path";

async function updateGalleryItem(id: string, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as File | null;

  let imageUrl: string | undefined;

  // If new image uploaded
  if (image && image.size > 0) {
    // Get old image to delete
    const oldItem = await prisma.gallery.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

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
    if (oldItem?.imageUrl && oldItem.imageUrl.startsWith("/uploads/")) {
      try {
        const oldFilepath = path.join(
          process.cwd(),
          "public",
          oldItem.imageUrl
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
  redirect("/admin/gallery");
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
