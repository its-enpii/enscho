import { prisma } from "@/lib/prisma";
import {
  Award,
  Briefcase,
  Share2,
  MessageCircle,
  FileText,
} from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AlumniDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) redirect("/");
  const [userId] = session.split(":");

  // Fetch Stats for Alumni
  // Alumni can manage News (Berita) & Static Pages.

  const myPostsCount = await prisma.post.count({
    where: { authorId: userId },
  });

  const myPagesCount = await prisma.page.count({
    where: { authorId: userId },
  });

  // Fetch recent news (general)
  const recentNews = await prisma.post.findMany({
    where: { category: "news", published: true },
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  // Fetch 'loker' (Job Vacancies) - assuming category 'loker' exists or general news
  const jobVacancies = await prisma.post.findMany({
    where: { category: "loker", published: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Akses Alumni</h1>
        <p className="text-slate-500">
          Terhubung kembali dengan teman angkatan dan almamater.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            label: "Artikel Saya",
            count: myPostsCount.toString(),
            icon: Briefcase,
            color: "blue",
            href: "/admin/posts",
          },
          {
            label: "Halaman Saya",
            count: myPagesCount.toString(),
            icon: FileText,
            color: "emerald",
            href: "/admin/pages",
          },
          {
            label: "Lowongan Kerja",
            count:
              jobVacancies.length > 0 ? jobVacancies.length.toString() : "0",
            icon: MessageCircle,
            color: "purple",
            href: "#",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 font-primary">
            Lowongan Kerja Terbaru (Loker)
          </h2>
          <div className="space-y-4">
            {jobVacancies.length > 0 ? (
              jobVacancies.map((job, i) => (
                <Link
                  key={i}
                  href={`/berita/${job.slug}`}
                  target="_blank"
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 block hover:bg-slate-100 transition-colors"
                >
                  <p className="font-bold text-slate-800">{job.title}</p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {job.excerpt || "Klik untuk melihat detail lowongan."}
                  </p>
                  <div className="mt-2 text-xs font-semibold text-blue-600">
                    Terbit:{" "}
                    {new Date(job.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Briefcase size={48} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">
                  Belum ada info lowongan kerja.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Berita Sekolah Terbaru
          </h2>
          <div className="space-y-4">
            {recentNews.length > 0 ? (
              recentNews.map((news, i) => (
                <Link
                  key={i}
                  href={`/berita/${news.slug}`}
                  target="_blank"
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 block hover:bg-slate-100 transition-colors"
                >
                  <p className="font-bold text-slate-800">{news.title}</p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {news.excerpt}
                  </p>
                  <div className="mt-2 text-xs text-slate-400">
                    {new Date(news.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <FileText size={48} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">Belum ada berita terbaru.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
