import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

export default async function BeritaPage() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      category: { not: "loker" },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-blue-900 py-16 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Berita & Artikel
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Kabar terbaru dan informasi seputar kegiatan sekolah.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length === 0 ? (
            <p className="col-span-full text-center text-slate-500">
              Belum ada berita yang dipublikasikan.
            </p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/berita/${post.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full bg-slate-200">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {post.createdAt.toLocaleDateString("id-ID")}
                    </span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-blue-600 text-sm font-semibold hover:underline">
                    Baca Selengkapnya &rarr;
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
