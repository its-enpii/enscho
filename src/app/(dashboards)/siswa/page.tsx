import { prisma } from "@/lib/prisma";
import { BookOpen, Calendar, FileText, Image as ImageIcon } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SiswaDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) redirect("/");
  const [userId] = session.split(":");

  // Fetch Stats
  const myGalleryCount = await prisma.gallery.count({
    where: { authorId: userId },
  });

  const latestDocuments = await prisma.document.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const upcomingEvents = await prisma.post.findMany({
    where: { category: "agenda", published: true },
    take: 2,
    orderBy: { createdAt: "asc" }, // Closest future event first? Ideally need date field, using createdAt for now
  });

  // Also get latest general news
  const latestNews = await prisma.post.findMany({
    where: { category: "news", published: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Siswa</h1>
        <p className="text-slate-500">
          Selamat datang kembali! Akses informasi dan materi belajar di sini.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Galeri Saya",
            count: myGalleryCount.toString(),
            icon: ImageIcon,
            color: "blue",
            href: "/siswa/gallery",
          },
          {
            label: "Dokumen Baru",
            count: latestDocuments.length.toString(),
            icon: FileText,
            color: "amber",
            href: "#",
          },
          {
            label: "Agenda",
            count: upcomingEvents.length.toString(),
            icon: Calendar,
            color: "emerald",
            href: "#",
          },
          {
            label: "Berita",
            count: latestNews.length.toString(),
            icon: BookOpen,
            color: "indigo",
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Berita & Pengumuman Terbaru
          </h2>
          <div className="space-y-4">
            {latestNews.length > 0 ? (
              latestNews.map((news, i) => (
                <Link
                  key={i}
                  href={`/berita/${news.slug}`}
                  target="_blank"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {news.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(news.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {/* <div className="text-blue-600 font-bold text-sm">Baca</div> */}
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <BookOpen size={48} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">Belum ada berita terbaru.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Agenda Sekolah
          </h2>
          <div className="space-y-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, i) => (
                <Link
                  key={i}
                  href={`/berita/${event.slug}`}
                  target="_blank"
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 text-center group-hover:text-blue-600 transition-colors">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      {new Date(event.createdAt).toLocaleDateString("id-ID", {
                        month: "short",
                      })}
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {new Date(event.createdAt).getDate()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {event.excerpt || "Agenda kegiatan sekolah."}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Calendar size={48} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">
                  Tidak ada agenda dalam waktu dekat.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
