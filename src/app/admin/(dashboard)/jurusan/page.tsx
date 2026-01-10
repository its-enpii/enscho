import { prisma } from "@/lib/prisma";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "../../components/DeleteButton";
import { cookies } from "next/headers";
import { deleteMajor } from "./actions";

export default async function AdminMajorsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const adminSession = cookieStore.get("admin_session")?.value;

  let currentUserId = "";
  let currentRole = "ADMIN";

  if (session) {
    [currentUserId, currentRole] = session.split(":");
  } else if (!adminSession) {
    return null;
  }

  const majors = await prisma.major.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      authorId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const canManageAll =
    currentRole === "ADMIN" ||
    currentRole === "TEACHER" ||
    currentRole === "ALUMNI" ||
    !!adminSession;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Kelola Jurusan</h1>
        <Link
          href="/admin/jurusan/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Jurusan
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm text-slate-700 uppercase">
                Nama Jurusan
              </th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-700 uppercase">
                Slug
              </th>
              <th className="px-6 py-4 font-semibold text-sm text-right text-slate-700 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {majors.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-slate-500 font-medium"
                >
                  Belum ada data jurusan. Silakan tambah baru.
                </td>
              </tr>
            ) : (
              majors.map((major) => (
                <tr
                  key={major.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {major.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-sm">
                    {major.slug}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      {canManageAll || major.authorId === currentUserId ? (
                        <>
                          <Link
                            href={`/admin/jurusan/${major.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </Link>
                          <DeleteButton id={major.id} onDelete={deleteMajor} />
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded-md">
                          View Only
                        </span>
                      )}
                    </div>
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
