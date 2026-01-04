"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface HeroSlide {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
}

interface HeroSectionProps {
  slides: HeroSlide[];
  fallbackBanner?: string | null;
  tagline?: string | null;
}

export function HeroSection({ slides, fallbackBanner, tagline }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // If no slides, show fallback or default placeholder
  if (slides.length === 0) {
    const bgImage = fallbackBanner || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop';
    
    return (
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Hero Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Selamat Datang di <br/> <span className="text-blue-400">SMK Enscho</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-200 mb-8"
          >
            {tagline || "Mewujudkan Generasi Unggul, Berkarakter, dan Siap Kerja"}
          </motion.p>
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="flex justify-center gap-4"
          >
             <Link href="/ppdb" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all">
                Daftar PPDB
             </Link>
             <Link href="/profil" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 px-8 py-3 rounded-full font-semibold transition-all">
                Profil Sekolah
             </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] bg-slate-900 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
           key={current}
           className="absolute inset-0"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1 }}
        >
           {/* Background Image */}
           <img 
              src={slides[current].imageUrl} 
              alt={slides[current].title || "Slide"} 
              className="w-full h-full object-cover"
           />
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center">
         <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <AnimatePresence mode="wait">
                <div key={current} className="overflow-hidden">
                   {slides[current].title && (
                    <motion.h2 
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
                    >
                      {slides[current].title}
                    </motion.h2>
                   )}
                   {slides[current].subtitle && (
                    <motion.p 
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg leading-relaxed"
                    >
                      {slides[current].subtitle}
                    </motion.p>
                   )}
                   
                   <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                   >
                     {slides[current].link ? (
                       <Link href={slides[current].link!} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30 group/btn">
                         Selengkapnya <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                     ) : (
                       <Link href="/ppdb" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30 group/btn">
                         Daftar Sekarang <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                     )}
                   </motion.div>
                </div>
              </AnimatePresence>
            </div>
         </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button 
             onClick={handlePrev}
             className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
             <ChevronLeft size={24} />
          </button>
          <button 
             onClick={handleNext}
             className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
             <ChevronRight size={24} />
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={clsx(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  current === idx ? "w-8 bg-blue-500" : "bg-white/50 hover:bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
