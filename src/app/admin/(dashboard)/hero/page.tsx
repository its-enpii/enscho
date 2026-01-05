import { prisma } from "@/lib/prisma";
import { Image as ImageIcon, Plus, MoveUp, MoveDown } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import HeroSlidesList from "./_components/HeroSlidesList";

export const dynamic = "force-dynamic";

async function deleteSlide(id: string) {
  "use server";
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/admin/hero");
}

async function updateOrder(id: string, direction: "up" | "down") {
  "use server";

  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) return;

  const currentOrder = slide.order;
  const targetOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

  // Find slide at target position
  const targetSlide = await prisma.heroSlide.findFirst({
    where: { order: targetOrder },
  });

  if (targetSlide) {
    // Swap orders
    await prisma.heroSlide.update({
      where: { id: targetSlide.id },
      data: { order: currentOrder },
    });
  }

  await prisma.heroSlide.update({
    where: { id },
    data: { order: targetOrder },
  });

  revalidatePath("/admin/hero");
}

export default async function HeroSlidesPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hero Carousel</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola slide banner di halaman beranda
          </p>
        </div>
        <Link
          href="/admin/hero/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Tambah Slide
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Slides</p>
              <p className="text-2xl font-bold text-slate-900">
                {slides.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Aktif</p>
              <p className="text-2xl font-bold text-slate-900">
                {slides.filter((s) => s.active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Tidak Aktif</p>
              <p className="text-2xl font-bold text-slate-900">
                {slides.filter((s) => !s.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <HeroSlidesList
        slides={slides as any}
        onDelete={deleteSlide}
        onUpdateOrder={updateOrder}
      />
    </div>
  );
}
