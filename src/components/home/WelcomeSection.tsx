"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, GraduationCap, Building2 } from "lucide-react";

interface WelcomeSectionProps {
  content: string; // The rich text content (Sambutan full)
  headmasterImage?: string | null;
  welcomeTitle?: string | null;
  welcomeDescription?: string | null;
  stats: {
    students: string | number;
    teachers: string | number;
    partners: string | number;
  };
}

export function WelcomeSection({ content, headmasterImage, stats, welcomeTitle, welcomeDescription }: WelcomeSectionProps) {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Image Side */}
          <div className="lg:w-5/12 relative">
             <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
             
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                {headmasterImage ? (
                  <img 
                    src={headmasterImage} 
                    alt="Kepala Sekolah" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <span className="text-sm">Foto Kepala Sekolah Belum Diupload</span>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6 text-white">
                   <h3 className="font-bold text-xl">Kepala Sekolah</h3>
                   <p className="text-slate-300 text-sm">SMK Enscho</p>
                </div>
             </div>
          </div>

          {/* Right: Content Side */}
          <div className="lg:w-7/12">
             <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
                Sambutan Kepala Sekolah
             </span>
             <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {welcomeTitle || <span>Mencetak Generasi <span className="text-blue-600">Juara & Berkarakter</span></span>}
             </h2>

             {welcomeDescription && (
                <p className="text-slate-600 text-lg mb-6 font-medium">
                  {welcomeDescription}
                </p>
             )}

             <div className="prose prose-lg text-slate-500 mb-8 line-clamp-4 leading-relaxed text-base">
                <div dangerouslySetInnerHTML={{ __html: content }} />
             </div>

             <div className="grid grid-cols-3 gap-6 mb-10 border-t border-slate-100 pt-8">
                <div className="text-center md:text-left">
                   <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                      <Users className="text-blue-600" size={24} />
                      <span className="text-3xl font-bold text-slate-900">{stats.students}</span>
                   </div>
                   <p className="text-sm text-slate-500">Siswa Aktif</p>
                </div>
                <div className="text-center md:text-left">
                   <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                      <GraduationCap className="text-blue-600" size={24} />
                      <span className="text-3xl font-bold text-slate-900">{stats.teachers}</span>
                   </div>
                   <p className="text-sm text-slate-500">Guru & Staf</p>
                </div>
                <div className="text-center md:text-left">
                   <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                      <Building2 className="text-blue-600" size={24} />
                      <span className="text-3xl font-bold text-slate-900">{stats.partners}</span>
                   </div>
                   <p className="text-sm text-slate-500">Mitra Industri</p>
                </div>
             </div>

             <Link href="/profil/sambutan" className="inline-flex items-center gap-2 text-blue-600 font-semibold group/link hover:text-blue-700">
                Baca Selengkapnya <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
             </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
