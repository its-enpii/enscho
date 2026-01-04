import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

export default async function JurusanIndexPage() {
  const majors = await prisma.major.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
         <div className="container mx-auto px-4 py-16 text-center">
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Program Pendidikan</span>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mt-2 mb-6">Kompetensi Keahlian</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
               SMK Enscho menawarkan berbagai pilihan jurusan yang relevan dengan kebutuhan industri saat ini, 
               didukung dengan fasilitas praktik yang lengkap dan kurikulum standar industri.
            </p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-16">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majors.length > 0 ? (
              majors.map((major) => (
                <div key={major.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="h-56 bg-slate-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      {major.imageUrl ? (
                         <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${major.imageUrl}')` }} />
                      ) : (
                         <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
                           <Briefcase className="text-slate-400" size={48} />
                         </div>
                      )}
                      <div className="absolute bottom-4 left-4 z-20">
                          <h3 className="text-white text-xl font-bold">{major.name}</h3>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                        {major.description}
                      </p>
                      <Link href={`/jurusan/${major.slug}`} className="inline-flex items-center text-blue-600 font-bold hover:gap-2 transition-all mt-auto">
                        Pelajari Selengkapnya <ArrowRight size={18} className="ml-1" />
                      </Link>
                    </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <Briefcase className="text-slate-400" size={24} />
                 </div>
                 <h3 className="text-lg font-medium text-slate-900">Belum ada data jurusan</h3>
                 <p className="text-slate-500 mt-2">Silakan cek kembali nanti.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
