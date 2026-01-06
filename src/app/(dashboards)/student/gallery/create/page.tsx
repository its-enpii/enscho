import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GalleryForm from "@/app/admin/(dashboard)/gallery/_components/GalleryForm";
import { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

async function createStudentGalleryItem(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    throw new Error("Unauthorized");
  }

  const authorId = session.split(":")[0];

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as File;

  if (!image) {
    throw new Error("Image is required");
  }

  // Generate unique filename
  const timestamp = Date.now();
  const originalName = image.name.replace(/\s+/g, "-");
  const filename = `${timestamp}-${originalName}`;

  // Save file to public/uploads/gallery
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
  const filepath = path.join(uploadDir, filename);

  try {
    await writeFile(filepath, buffer);
  } catch (error) {
    console.error("Error writing file:", error);
    throw new Error("Gagal menyimpan file gambar");
  }

  // Save to database with relative path
  const imageUrl = `/uploads/gallery/${filename}`;

  await prisma.gallery.create({
    data: {
      title,
      imageUrl,
      category,
      authorId,
    },
  });

  revalidatePath("/siswa/gallery");
  redirect("/siswa/gallery");
}

export default function CreateStudentGalleryPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/siswa/gallery"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={20} />
          Kembali ke Galeri
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Upload Foto Baru</h1>
        <p className="text-sm text-slate-500 mt-1">
          Bagikan momen kegiatan sekolahmu
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <GalleryForm action={createStudentGalleryItem} />
      </div>
    </div>
  );
}
