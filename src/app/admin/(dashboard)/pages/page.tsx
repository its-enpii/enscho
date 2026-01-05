import { prisma } from "@/lib/prisma";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import PagesTable from "./_components/PagesTable";

export default async function AdminPagesList() {
  const pages = await prisma.page.findMany({
    where: {
      slug: {
        notIn: ["akademik-landing"],
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const PROTECTED_SLUGS = [
    "sambutan",
    "sambutan-kepala-sekolah",
    "struktur",
    "sarpras",
    "sejarah",
    "visi-misi",
  ];

  async function deletePage(id: string) {
    "use server";
    try {
      const page = await prisma.page.findUnique({ where: { id } });
      if (page && PROTECTED_SLUGS.includes(page.slug)) {
        return {
          success: false,
          error: "Halaman ini dilindungi dan tidak dapat dihapus.",
        };
      }

      await prisma.page.delete({ where: { id } });
      revalidatePath("/admin/pages");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Gagal menghapus halaman" };
    }
  }

  const stats = {
    total: pages.length,
    protected: pages.filter((p) => PROTECTED_SLUGS.includes(p.slug)).length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kelola Halaman (Statis)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola konten halaman statis website (Visi Misi, Sejarah, dll)
          </p>
        </div>
        <Link
          href="/admin/pages/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} /> Tambah Halaman
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Total Halaman
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Halaman Protected
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.protected}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PagesTable
        pages={pages}
        protectedSlugs={PROTECTED_SLUGS}
        onDelete={deletePage}
      />
    </div>
  );
}
