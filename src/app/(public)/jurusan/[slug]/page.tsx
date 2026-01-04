import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function MajorPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params for dynamic routing
  const { slug } = await params;
  
  // Fetch current major
  const major = await prisma.major.findUnique({
    where: { slug }
  }) as any;

  if (!major) {
    return notFound();
  }

  // Fetch other majors for sidebar
  const otherMajors = await prisma.major.findMany({
    where: { 
      slug: { not: slug }
    },
    select: {
      name: true,
      slug: true
    }
  });

  // Parse lists
  const prospects = major.careerProspects 
    ? major.careerProspects.split('\n').filter(Boolean) 
    : [];
    
  const competencies = major.competencies 
    ? major.competencies.split('\n').filter(Boolean) 
    : [];

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
       <div className="relative h-[500px]">
          <div className="absolute inset-0 bg-slate-900/70 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${major.imageUrl || 'https://via.placeholder.com/1200x500?text=Jurusan+SMK'})` }} 
          />
          <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center max-w-6xl">
             <span className="text-blue-400 font-bold tracking-wider text-sm mb-3 uppercase bg-white/10 w-fit px-4 py-1 rounded-full backdrop-blur-sm border border-white/20">
               Paket Keahlian
             </span>
             <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl">
               {major.name}
             </h1>
             <p className="text-slate-200 text-lg md:text-xl max-w-2xl leading-relaxed">
               {major.description}
             </p>
          </div>
       </div>

       <div className="container mx-auto px-4 py-16 max-w-6xl">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
               {/* About Section */}
               <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
                 <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                   Tentang Program Keahlian
                 </h2>
                 <article 
                    className="prose prose-slate max-w-none prose-lg text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: major.content || "<p>Belum ada deskripsi lengkap.</p>" }} 
                 />
               </section>

               {/* Competencies Section */}
               {competencies.length > 0 && (
                 <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                     Kompetensi yang Dipelajari
                   </h2>
                   <div className="grid grid-cols-1 gap-4">
                      {competencies.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-4 group">
                           <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1 group-hover:bg-blue-600 transition-colors">
                              <CheckCircle2 className="text-blue-600 w-4 h-4 group-hover:text-white transition-colors" />
                           </div>
                           <p className="text-slate-700 font-medium leading-relaxed group-hover:text-blue-700 transition-colors">
                             {item}
                           </p>
                        </div>
                      ))}
                   </div>
                 </section>
               )}
            </div>

            {/* Sidebar Sticky */}
            <div className="space-y-8 sticky top-24 h-fit">
               
               {/* Prospects Card */}
               {prospects.length > 0 && (
                 <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <BriefcaseIcon /> Prospek Karir
                    </h3>
                    <ul className="space-y-4">
                       {prospects.map((job: string, idx: number) => (
                         <li key={idx} className="flex items-center gap-3 text-slate-300 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                            <span>{job}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
               )}

               {/* Navigation Card */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Jurusan Lainnya</h3>
                  <div className="space-y-1">
                     {otherMajors.map((m: any) => (
                        <Link 
                          key={m.slug} 
                          href={`/jurusan/${m.slug}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-all group"
                        >
                           <span className="font-medium text-sm">{m.name}</span>
                           <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                     ))}
                  </div>
               </div>

               {/* CTA Card */}
               <div className="bg-blue-600 p-8 rounded-2xl text-white text-center shadow-lg shadow-blue-900/20">
                  <h3 className="text-xl font-bold mb-2">Tertarik Bergabung?</h3>
                  <p className="text-blue-100 text-sm mb-6">
                     Jadilah bagian dari ahli {major.name} masa depan bersama SMK Enscho.
                  </p>
                  <Link href="/ppdb" className="block w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors mb-4">
                     Daftar Sekarang
                  </Link>
                  <div className="flex justify-center gap-4 text-blue-200 text-sm">
                     <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 hover:text-white transition-colors"
                     >
                        <Phone size={14}/> Hubungi Kami
                     </a>
                  </div>
               </div>

            </div>
         </div>
       </div>
    </div>
  );
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 shrink-0">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
