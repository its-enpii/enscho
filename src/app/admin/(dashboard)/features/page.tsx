import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage() {
  const features = await prisma.schoolFeature.findMany({
    orderBy: { order: "asc" },
  });

  async function deleteFeature(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.schoolFeature.delete({ where: { id } });
    revalidatePath("/admin/features");
    revalidatePath("/"); // Revalidate homepage
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Award size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Keunggulan Sekolah
            </h1>
            <p className="text-slate-500 text-sm">
              Kelola poin-poin keunggulan yang tampil di beranda.
            </p>
          </div>
        </div>
        <Link
          href="/admin/features/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Tambah Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-200 transition-all"
          >
            <div className={`h-2 w-full bg-${feature.color}-500`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="font-mono text-xs text-slate-400">
                  Order: {feature.order}
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold bg-${feature.color}-50 text-${feature.color}-700 border border-${feature.color}-100 capitalize`}
                >
                  {feature.color}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {feature.description}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/admin/features/${feature.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Pencil size={14} /> Edit
                </Link>
                <form action={deleteFeature}>
                  <input type="hidden" name="id" value={feature.id} />
                  <button
                    type="submit"
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {features.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Award className="mx-auto mb-3 text-slate-400" size={48} />
            <p>Belum ada fitur/keunggulan yang ditambahkan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
