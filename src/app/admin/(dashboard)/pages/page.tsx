import { prisma } from "@/lib/prisma";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { DeleteButton } from "../../components/DeleteButton";

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
    "gurustaf", // Just in case, though usually not a page
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Kelola Halaman (Statis)
        </h1>
        <Link
          href="/admin/pages/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Halaman
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm">Judul Halaman</th>
              <th className="px-6 py-4 font-semibold text-sm">Slug</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pages.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  Belum ada halaman.
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr
                  key={page.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {page.title}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{page.slug}</td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    <Link
                      href={`/admin/pages/${page.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </Link>
                    {!PROTECTED_SLUGS.includes(page.slug) && (
                      <DeleteButton id={page.id} onDelete={deletePage} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
