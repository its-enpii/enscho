import { prisma } from "@/lib/prisma";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { DeleteButton } from "../../components/DeleteButton";

export default async function AdminMajorsPage() {
  const majors = await prisma.major.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function deleteMajor(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.major.delete({ where: { id } });
    revalidatePath("/", "layout");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Kelola Jurusan</h1>
        <Link href="/admin/jurusan/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <Plus size={18} /> Tambah Jurusan
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm">Nama Jurusan</th>
              <th className="px-6 py-4 font-semibold text-sm">Slug</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {majors.length === 0 ? (
               <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                     Belum ada data jurusan. Silakan tambah baru.
                  </td>
               </tr>
            ) : (
                majors.map((major) => (
                  <tr key={major.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{major.name}</td>
                    <td className="px-6 py-4 text-slate-500">{major.slug}</td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <Link href={`/admin/jurusan/${major.id}/edit`} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={18} />
                      </Link>
                      <form action={deleteMajor}>
                        <input type="hidden" name="id" value={major.id} />
                        <DeleteButton />
                      </form>
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
