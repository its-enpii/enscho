import { Calendar, Book, Clock, GraduationCap, FileText, Download, Award, Users, Building2, Activity } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AkademikPage() {
  // Fetch Page Content for "Program Unggulan"
  const pageContent = await prisma.page.findUnique({
    where: { slug: "akademik-landing" }
  });

  // Fetch Documents
  const documents = await prisma.document.findMany({
    where: { category: "akademik" },
    orderBy: { createdAt: "desc" }
  });

  const academicFeatures = [
    {
      icon: Book,
      title: "Kurikulum Sekolah",
      description: "Penjelasan mengenai kurikulum, metode pembelajaran, dan standar kompetensi siswa.",
      action: "Lihat Kurikulum",
      href: "/akademik/kurikulum"
    },
    {
      icon: Activity,
      title: "Ekstrakurikuler",
      description: "Informasi kegiatan pengembangan minat dan bakat siswa di luar jam pelajaran.",
      action: "Lihat Ekskul",
      href: "/akademik/ekskul"
    },
    {
      icon: Calendar,
      title: "Kalender Akademik",
      description: "Jadwal kegiatan sekolah, ujian semester, dan agenda penting lainnya.",
      action: "Lihat Kalender",
      href: "/akademik/kalender"
    },
    {
      icon: Building2,
      title: "Fasilitas Sekolah",
      description: "Profil lengkap sarana dan prasarana penunjang kegiatan belajar mengajar.",
      action: "Lihat Fasilitas",
      href: "/akademik/fasilitas"
    }
  ];

  // Fetch school config for contact info
  const config = await prisma.schoolConfig.findUnique({
    where: { id: "config" }
  });

  const whatsappUrl = config?.phone 
    ? `https://wa.me/${config.phone.replace(/^0/, '62').replace(/\D/g, '')}` 
    : "/kontak";

  return (
    <div className="bg-slate-50 min-h-screen">
       {/* Hero Section */}
       <div className="bg-blue-900 text-white relative overflow-hidden">
         {/* ... (keep hero content) */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000')] bg-cover bg-center opacity-20" />
         <div className="container mx-auto px-4 py-20 relative z-10 text-center">
            <span className="text-blue-300 font-semibold tracking-wide uppercase text-sm">Informasi Akademik</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">Akademik & Pembelajaran</h1>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
              Mengedepankan standar pendidikan berkualitas dengan kurikulum yang adaptif dan metode pembelajaran yang inovatif untuk mencetak lulusan kompeten.
            </p>
         </div>
       </div>

       <div className="container mx-auto px-4 py-16">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
             {academicFeatures.map((feature, idx) => (
                <Link href={feature.href} key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all group block">
                   <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon size={28} />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                   <p className="text-slate-600 mb-6 leading-relaxed">
                      {feature.description}
                   </p>
                   <span className="text-blue-600 font-bold text-sm uppercase tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
                      {feature.action} <FileText size={16} />
                   </span>
                </Link>
             ))}
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-8">
                <section className="bg-white p-8 rounded-2xl border border-slate-200">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6">Program Unggulan</h2>
                   <div className="prose prose-slate max-w-none text-slate-600">
                      {pageContent ? (
                        <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
                      ) : (
                        <>
                          <p>
                             SMK Enscho menerapkan sistem pembelajaran berbasis proyek (Project Based Learning) yang terintegrasi dengan industri. 
                             Setiap siswa tidak hanya belajar teori, tetapi juga terlibat langsung dalam proyek nyata yang relevan dengan kompetensi keahliannya.
                          </p>
                          <ul className="list-disc pl-5 space-y-2 mt-4">
                             <li><strong>Teaching Factory (TEFA):</strong> Pembelajaran berbasis produksi/jasa yang mengacu pada standar dan prosedur industri.</li>
                             <li><strong>Sertifikasi Kompetensi:</strong> Uji kompetensi keahlian (UKK) bekerjasama dengan LSP dan Dunia Industri.</li>
                             <li><strong>Program Magang (PKL):</strong> Praktik kerja lapangan minimal 6 bulan di perusahaan mitra berskala nasional/internasional.</li>
                             <li><strong>Kelas Industri:</strong> Kelas khusus yang kurikulumnya disinkronisasi langsung dengan kebutuhan industri mitra.</li>
                          </ul>
                          <p className="text-sm text-slate-400 mt-6 italic">
                            *Konten ini dapat diubah melalui Admin Panel (Menu Halaman {'>'} Buat baru dengan slug: <strong>akademik-landing</strong>)
                          </p>
                        </>
                      )}
                   </div>
                </section>
             </div>

             <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Download size={20} className="text-blue-600" />
                      Dokumen Unduhan
                   </h3>
                   <div className="space-y-3">
                      {documents.length > 0 ? (
                        documents.map((file) => (
                           <a href={file.fileUrl} key={file.id} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-3 overflow-hidden">
                                 <FileText size={18} className="text-slate-400 group-hover:text-blue-500 shrink-0" />
                                 <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors truncate">{file.title}</span>
                              </div>
                              <span className="text-xs text-slate-400 shrink-0 ml-2">{file.size}</span>
                           </a>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-500 text-sm">
                          Belum ada dokumen.
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="bg-blue-600 p-8 rounded-2xl text-white text-center">
                   <h3 className="text-xl font-bold mb-4">Butuh Informasi Lebih?</h3>
                   <p className="text-blue-100 text-sm mb-6">
                      Silakan hubungi bagian akademik atau tata usaha kami untuk informasi lebih detail.
                   </p>
                   <a 
                      href={whatsappUrl} 
                      target={config?.phone ? "_blank" : undefined}
                      rel="noopener noreferrer" 
                      className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors w-full"
                   >
                      Hubungi Kami
                   </a>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
