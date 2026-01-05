"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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

export function HeroSection({
  slides,
  fallbackBanner,
  tagline,
}: HeroSectionProps) {
  const [current, setCurrent] = useState(0);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000); // Slower interval for better readability
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const handlePrev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Text Animation Variants
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.8, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  // If no slides, show fallback or default placeholder
  const activeSlides =
    slides.length > 0
      ? slides
      : [
          {
            id: "default",
            title: "Selamat Datang di SMK Enscho",
            subtitle:
              tagline ||
              "Mewujudkan Generasi Unggul, Berkarakter, dan Siap Kerja",
            imageUrl:
              fallbackBanner ||
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop",
            link: null,
          },
        ];

  const currentSlide = activeSlides[current];

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full bg-slate-950 overflow-hidden group">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id + current} // Force re-render on change
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }} // Smooth fade out
          transition={{ duration: 1.5 }}
        >
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.title || "Slide"}
            className="w-full h-full object-cover opacity-80"
          />
          {/* Modern Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles/Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <div key={current} className="space-y-6">
                {/* Badge or Tag */}
                <motion.div
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-md text-blue-200 text-sm font-medium tracking-wide"
                >
                  <Sparkles size={14} className="text-blue-400" />
                  <span>Pusat Keunggulan</span>
                </motion.div>

                {/* Title */}
                <motion.h2
                  custom={1}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg"
                >
                  {currentSlide.title?.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className={
                        i % 3 === 0 && i !== 0
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"
                          : ""
                      }
                    >
                      {word}{" "}
                    </span>
                  ))}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  custom={2}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-lg md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-light"
                >
                  {currentSlide.subtitle}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  custom={3}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-wrap gap-4 pt-4"
                >
                  {currentSlide.link ? (
                    <Link
                      href={currentSlide.link}
                      className="relative group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold overflow-hidden transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Selengkapnya{" "}
                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/ppdb"
                        className="relative group px-8 py-4 bg-white text-slate-900 rounded-full font-bold overflow-hidden transition-all hover:bg-slate-100 shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Daftar Sekarang{" "}
                          <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </Link>
                      <Link
                        href="/profil"
                        className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm transition-all flex items-center gap-2"
                      >
                        Profil Sekolah
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {activeSlides.length > 1 && (
        <>
          <div className="absolute bottom-12 right-12 z-20 flex gap-4 items-center">
            <button
              onClick={handlePrev}
              className="w-14 h-14 rounded-full border border-white/10 bg-black/20 hover:bg-blue-600 hover:border-blue-600 text-white backdrop-blur-md flex items-center justify-center transition-all group/nav"
            >
              <ChevronLeft
                size={24}
                className="group-hover/nav:-translate-x-0.5 transition-transform"
              />
            </button>
            <button
              onClick={handleNext}
              className="w-14 h-14 rounded-full border border-white/10 bg-black/20 hover:bg-blue-600 hover:border-blue-600 text-white backdrop-blur-md flex items-center justify-center transition-all group/nav"
            >
              <ChevronRight
                size={24}
                className="group-hover/nav:translate-x-0.5 transition-transform"
              />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-12 left-12 z-20 flex gap-3">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-500",
                  current === idx
                    ? "w-12 bg-blue-500"
                    : "w-4 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 z-20 cursor-pointer"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        <span className="text-xs uppercase tracking-widest font-light">
          Scroll Down
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </div>
  );
}
