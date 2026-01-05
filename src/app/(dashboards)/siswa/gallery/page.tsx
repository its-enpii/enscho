import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import GalleryTable from "@/app/admin/(dashboard)/gallery/_components/GalleryTable";
import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Kelola Galeri Siswa",
  description: "Upload dan kelola foto kegiatan siswa",
};

export const dynamic = "force-dynamic";

async function deleteGalleryItem(id: string) {
  "use server";

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    throw new Error("Unauthorized");
  }

  const [currentUserId] = session.split(":");

  // Get item to delete file and check ownership
  const item = await prisma.gallery.findUnique({
    where: { id },
    select: { imageUrl: true, authorId: true },
  });

  if (!item) throw new Error("Item not found");

  // Student can only delete their own items
  if (item.authorId !== currentUserId) {
    throw new Error("Anda hanya dapat menghapus foto milik sendiri");
  }

  // Delete from database
  await prisma.gallery.delete({ where: { id } });

  // Delete physical file if it's local
  if (item?.imageUrl && item.imageUrl.startsWith("/uploads/")) {
    try {
      const filepath = path.join(process.cwd(), "public", item.imageUrl);
      await unlink(filepath);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }

  revalidatePath("/siswa/gallery");
}

export default async function SiswaGalleryPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;
  const [currentUserId] = session.split(":");

  // Display ALL gallery items
  const items = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      category: true,
      createdAt: true,
      authorId: true,
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Galeri Foto</h1>
          <p className="text-slate-500">
            Lihat semua foto dan upload kegiatanmu.
          </p>
        </div>
        <Link
          href="/siswa/gallery/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Upload Foto
        </Link>
      </div>

      <GalleryTable
        items={items as any}
        onDelete={deleteGalleryItem}
        currentUserId={currentUserId}
        canManageAll={false}
        editPathPrefix="/siswa/gallery"
      />
    </div>
  );
}
