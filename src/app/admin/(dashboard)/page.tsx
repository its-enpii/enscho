import { prisma } from "@/lib/prisma";
import {
  Users,
  Newspaper,
  ClipboardList,
  GraduationCap,
  ChevronRight,
  Plus,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminDashboard() {
  const [
    countMajors,
    countPosts,
    countPPDB,
    countEmployees,
    countUsers,
    countGallery,
    recentPosts,
    recentPPDB,
  ] = await Promise.all([
    prisma.major.count(),
    prisma.post.count(),
    prisma.studentRegistration.count(),
    prisma.employee.count(),
    prisma.user.count(),
    prisma.gallery.count(),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, category: true },
    }),
    prisma.studentRegistration.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        namaLengkap: true,
        createdAt: true,
        status: true,
        registrationNo: true,
      },
    }),
  ]);

  const stats = [
    {
      label: "Pendaftar PPDB",
      value: countPPDB,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Berita & Artikel",
      value: countPosts,
      icon: Newspaper,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Kompetensi Keahlian",
      value: countMajors,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Guru & Staf",
      value: countEmployees,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const quickActions = [
    {
      label: "Tulis Berita",
      href: "/admin/posts/create",
      icon: Plus,
      color: "bg-blue-600",
    },
    {
      label: "Upload Galeri",
      href: "/admin/gallery",
      icon: ImageIcon,
      color: "bg-purple-600",
    },
    {
      label: "Pengaturan",
      href: "/admin/config",
      icon: Settings,
      color: "bg-slate-700",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Status dan aktivitas terbaru website sekolah.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent PPDB */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Pendaftar Terakhir</h2>
              <Link
                href="/admin/ppdb"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Semua <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentPPDB.length > 0 ? (
                recentPPDB.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                        {reg.namaLengkap.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {reg.namaLengkap}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {reg.registrationNo} • {formatDate(reg.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                        reg.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : reg.status === "VERIFIED"
                          ? "bg-blue-100 text-blue-700"
                          : reg.status === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Belum ada pendaftar baru.
                </div>
              )}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">
                Berita & Artikel Terbaru
              </h2>
              <Link
                href="/admin/posts"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Semua <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                        <span className="text-blue-600">{post.category}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Belum ada berita yang ditulis.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div
                    className={`${action.color} text-white p-2 rounded-lg group-hover:rotate-6 transition-transform`}
                  >
                    <action.icon size={18} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Website Info Check */}
          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="font-bold text-lg mb-2">Cek Website</h2>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                Pastikan semua konten yang Anda ubah tampil dengan benar di
                halaman depan.
              </p>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:gap-3"
              >
                Buka Website <ChevronRight size={16} />
              </Link>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
