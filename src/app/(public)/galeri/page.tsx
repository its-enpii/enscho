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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeri Foto</h1>
            <p className="text-lg text-blue-100">
              Dokumentasi kegiatan, prestasi, dan momen berharga di sekolah kami
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="container mx-auto px-4 py-12">
        <GalleryGrid items={items as any} categories={categories as string[]} />
      </div>
    </div>
  );
}
