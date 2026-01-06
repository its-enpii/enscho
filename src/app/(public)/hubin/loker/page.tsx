import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  ArrowRight,
} from "lucide-react";

export default async function HubinLokerPage() {
  const jobPosts = await prisma.post.findMany({
    where: {
      category: "loker",
      published: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-blue-900 text-white border-b border-white/10">
        <div className="container mx-auto px-4 py-16 text-center">
          <span className="text-blue-200 font-semibold tracking-wide uppercase text-sm">
            Bursa Kerja Khusus
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-2 mb-6">
            Info Lowongan Kerja
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Temukan peluang karir terbaik dari mitra industri kami. Informasi
            lowongan kerja terupdate khusus untuk alumni dan siswa tingkat
            akhir.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobPosts.length > 0 ? (
            jobPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="h-48 bg-slate-100 relative border-b border-slate-100">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                      <Briefcase size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Open Hiring
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {post.createdAt.toLocaleDateString("id-ID")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 size={12} /> Mitra Industri
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/berita/${post.slug}`}
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold rounded-xl transition-colors mt-auto"
                  >
                    Lihat Detail & Persyaratan
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-sm">
                <Briefcase className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Belum ada lowongan tersedia
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Saat ini belum ada informasi lowongan kerja baru. Silakan cek
                kembali secara berkala atau hubungi bagian BKK sekolah.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
