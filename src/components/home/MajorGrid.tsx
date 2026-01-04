"use client";

import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface Major {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
}

export function MajorGrid({ majors }: { majors: Major[] }) {
  if (majors.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
         <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Program Keahlian</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Pilihan Masa Depanmu</h2>
            <p className="text-slate-600 text-lg">
              Kami menyediakan berbagai kompetensi keahlian yang relevan dengan kebutuhan industri saat ini.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majors.map((major, idx) => (
               <motion.div 
                 key={major.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
               >
                  <div className="h-56 relative overflow-hidden bg-slate-200">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                     {major.imageUrl ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                          style={{ backgroundImage: `url('${major.imageUrl}')` }} 
                        />
                     ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                           <Briefcase size={48} opacity={0.5} />
                        </div>
                     )}
                     <div className="absolute bottom-4 left-4 z-20">
                        <h3 className="text-white text-xl font-bold group-hover:text-blue-300 transition-colors">{major.name}</h3>
                     </div>
                  </div>
                  <div className="p-6">
                     <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed text-sm">
                        {major.description}
                     </p>
                     <Link href={`/jurusan/${major.slug}`} className="inline-flex items-center text-slate-900 font-semibold text-sm hover:text-blue-600 transition-colors group/btn">
                        Lihat Detail <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                     </Link>
                  </div>
               </motion.div>
            ))}
         </div>
         
         <div className="text-center mt-12">
            <Link href="/jurusan" className="inline-block border border-slate-300 hover:border-blue-600 hover:text-blue-600 text-slate-600 font-semibold px-8 py-3 rounded-full transition-all">
               Lihat Semua Jurusan
            </Link>
         </div>
      </div>
    </section>
  );
}
