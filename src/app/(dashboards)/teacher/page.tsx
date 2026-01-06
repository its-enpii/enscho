import { prisma } from "@/lib/prisma";
import {
  Users,
  GraduationCap,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GuruDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) redirect("/");
  const [userId] = session.split(":");

  // Fetch Stats
  const majorCount = await prisma.major.count({
    // Teachers usually manage majors, but schema has `authorId` on Major? Yes.
    // Or simpler, count all majors or just explicitly assigned ones?
    // Let's assume teachers want to see all majors or the ones they created.
    // Querying all majors for now as "Kompetensi Keahlian" is a shared resource usually.
  });

  const myPostsCount = await prisma.post.count({
    where: { authorId: userId },
  });

  const myPagesCount = await prisma.page.count({
    where: { authorId: userId },
  });

  const recentPosts = await prisma.post.findMany({
    where: { authorId: userId },
    take: 5,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Portal Guru</h1>
        <p className="text-slate-500">
          Kelola konten pendidikan dan informasi sekolah.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Jurusan",
            count: majorCount.toString(),
            icon: GraduationCap,
            color: "blue",
            href: "/admin/jurusan",
          },
          {
            label: "Artikel Saya",
            count: myPostsCount.toString(),
            icon: ClipboardList,
            color: "emerald",
            href: "/admin/posts",
          },
          {
            label: "Halaman Saya",
            count: myPagesCount.toString(),
            icon: FileText,
            color: "amber",
            href: "/admin/pages",
          },
          {
            label: "Pengaturan",
            icon: Settings,
            color: "slate",
            href: "/admin/config",
          },
        ].map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`h-12 w-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600`}
            >
              {stat.icon && <stat.icon size={24} />}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              {stat.count && (
                <p className="text-2xl font-bold text-slate-900">
                  {stat.count}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Artikel & Berita Terakhir Anda
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-semibold text-slate-600">Judul</th>
                <th className="pb-4 font-semibold text-slate-600">Kategori</th>
                <th className="pb-4 font-semibold text-slate-600">Status</th>
                <th className="pb-4 font-semibold text-slate-600">
                  Tanggal Update
                </th>
                <th className="pb-4 font-semibold text-slate-600 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentPosts.length > 0 ? (
                recentPosts.map((post, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 font-medium text-slate-800">
                      {post.title}
                    </td>
                    <td className="py-4 text-slate-600 capitalize">
                      {post.category}
                    </td>
                    <td className="py-4 text-slate-600">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600">
                      {new Date(post.updatedAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-blue-600 font-semibold text-sm hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Anda belum menulis artikel apapun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
