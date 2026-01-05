"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Code,
  PenTool,
  Globe,
  ChevronRight,
} from "lucide-react";
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
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-4"
          >
            <GraduationCap size={16} />
            <span>Program Keahlian</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Pilihan Masa Depanmu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg leading-relaxed"
          >
            Kami menyediakan berbagai kompetensi keahlian yang relevan dengan
            kebutuhan industri saat ini, dirancang untuk mencetak lulusan siap
            kerja.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {majors.map((major, idx) => (
            <motion.div
              key={major.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-[420px] rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-slate-100 flex flex-col"
            >
              {/* Image Container */}
              <div className="h-1/2 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                {major.imageUrl ? (
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${major.imageUrl}')` }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Briefcase className="text-slate-300" size={48} />
                  </div>
                )}

                {/* Floating Icon */}
                <div className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors duration-300">
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex-1 flex flex-col bg-white relative z-20">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {major.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {major.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600 group-hover:underline decoration-2 underline-offset-4">
                    Pelajari Lebih Lanjut
                  </span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Accessible Full Card Link */}
              <Link
                href={`/jurusan/${major.slug}`}
                className="absolute inset-0 z-30"
              >
                <span className="sr-only">
                  Lihat detail jurusan {major.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link
            href="/jurusan"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-bold px-8 py-4 rounded-full transition-all shadow-sm hover:shadow-lg"
          >
            Lihat Semua Jurusan <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
