import { prisma } from "@/lib/prisma";
import { Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import GalleryTable from "./_components/GalleryTable";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function deleteGalleryItem(id: string) {
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

  // Get item to delete file and check ownership
  const item = await prisma.gallery.findUnique({
    where: { id },
    select: { imageUrl: true, authorId: true },
  });

  if (!item) throw new Error("Item not found");
  if (!canManageAll && item.authorId !== currentUserId) {
    throw new Error("You do not have permission to delete this item");
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

  revalidatePath("/admin/gallery");
}

export default async function AdminGalleryPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const adminSession = cookieStore.get("admin_session")?.value;

  let currentUserId = "";
  let currentRole = "ADMIN";

  if (session) {
    [currentUserId, currentRole] = session.split(":");
  } else if (!adminSession) {
    // Should not happen due to middleware, but for safety
    return null;
  }

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

  const stats = {
    total: items.length,
    categories: new Set(items.map((i) => i.category)).size,
  };

  // Get category counts
  const categoryCounts = items.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const canManageAll =
    currentRole === "ADMIN" || currentRole === "TEACHER" || !!adminSession;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Galeri Foto</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola foto dan dokumentasi kegiatan sekolah
          </p>
        </div>
        <Link
          href="/admin/gallery/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Tambah Foto
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Foto</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Kategori</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.categories}
              </p>
            </div>
          </div>
        </div>
        {topCategories.slice(0, 2).map(([category, count], idx) => (
          <div
            key={category}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${
                  idx === 0
                    ? "from-green-500 to-green-600"
                    : "from-amber-500 to-amber-600"
                } rounded-xl flex items-center justify-center shadow-lg`}
              >
                <ImageIcon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium truncate">
                  {category}
                </p>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <GalleryTable
        items={items as any}
        onDelete={deleteGalleryItem}
        currentUserId={currentUserId}
        canManageAll={canManageAll}
      />
    </div>
  );
}
