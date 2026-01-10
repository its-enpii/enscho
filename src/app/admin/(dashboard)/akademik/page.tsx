import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  GraduationCap,
  Book,
  Activity,
  Calendar,
  Building2,
} from "lucide-react";
import AkademikForm from "./_components/AkademikForm";

export default async function AdminAkademikPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "akademik-landing" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Pengaturan Akademik
          </h1>
          <p className="text-slate-500 text-sm">
            Kelola konten dan fitur halaman Akademik.
          </p>
        </div>
      </div>

      {/* Editor Section */}
      <AkademikForm page={page} />

      {/* Pages Management Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">
            Kelola Halaman Menu Akademik
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Kurikulum Sekolah",
              slug: "kurikulum",
              icon: <Book className="text-blue-600" />,
            },
            {
              title: "Ekstrakurikuler",
              slug: "ekskul",
              icon: <Activity className="text-emerald-600" />,
            },
            {
              title: "Kalender Akademik",
              slug: "kalender",
              icon: <Calendar className="text-purple-600" />,
            },
            {
              title: "Fasilitas Sekolah",
              slug: "fasilitas",
              icon: <Building2 className="text-orange-600" />,
            },
          ].map((item) => (
            <div
              key={item.slug}
              className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    /akademik/{item.slug}
                  </p>
                </div>
              </div>
              <Link
                href={`/admin/akademik/pages/${item.slug}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Edit Isi
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
