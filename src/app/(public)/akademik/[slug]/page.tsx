import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default async function AkademikDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Ideally fetch from 'Page' model if you reuse it, or just show placeholder for now
  // Since 'Page' model uses 'slug' unique, we can try to fetch it.
  const page = await prisma.page.findUnique({
    where: { slug }
  });

  if (page) {
    return (
      <div className="bg-white min-h-screen">
          <div className="bg-slate-50 border-b border-slate-200">
             <div className="container mx-auto px-4 py-12">
                <Link href="/akademik" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                   <ArrowLeft size={18} className="mr-2" /> Kembali ke Akademik
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900">{page.title}</h1>
             </div>
          </div>
          
          <div className="container mx-auto px-4 py-12">
             <div className="max-w-4xl mx-auto">
                <article className="prose prose-slate max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: page.content }} />
             </div>
          </div>
      </div>
    );
  }

  // Fallback for non-existent DB pages (Mock implementation for "demo" feel)
  const titleMap: Record<string, string> = {
    "kalender": "Kalender Akademik",
    "kurikulum": "Kurikulum Merdeka",
    "jadwal": "Jadwal Pelajaran",
    "prestasi": "Prestasi Siswa"
  };

  const title = titleMap[slug] || "Informasi Akademik";

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
       <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <BookOpen size={40} />
       </div>
       <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
       <p className="text-slate-600 max-w-md mb-8">
          Halaman ini sedang dalam proses pengembangan. Informasi detail akan segera tersedia.
       </p>
       <Link href="/akademik" className="btn-primary">
          Kembali ke Menu Akademik
       </Link>
    </div>
  );
}
