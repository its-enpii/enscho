import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import GalleryGrid from "./_components/GalleryGrid";

export const metadata: Metadata = {
  title: "Galeri Foto",
  description: "Dokumentasi kegiatan dan prestasi sekolah",
};

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const items = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Get unique categories
  const categories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  ).sort();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      {/* Header */}
      <div className="bg-blue-900 py-16 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Galeri Foto
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Dokumentasi kegiatan, prestasi, dan momen berharga di sekolah kami
          </p>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="container mx-auto px-4 py-12">
        <GalleryGrid items={items as any} categories={categories as string[]} />
      </div>
    </div>
  );
}
