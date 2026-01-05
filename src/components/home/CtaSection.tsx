"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";

export function CtaSection({
  primaryColor = "#2563eb",
}: {
  primaryColor?: string;
}) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 px-6 py-20 md:p-20 text-center md:text-left">
          {/* Background Effects */}
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ backgroundColor: `${primaryColor}4D` }} // 30% opacity
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"
            style={{ backgroundColor: `${primaryColor}33` }} // 20% opacity
          />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
              >
                Siap Menggapai <br />
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${primaryColor}, #ffffff)`,
                  }}
                >
                  Masa Depan Gemilang?
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
              >
                Bergabunglah bersama kami di SMK Enscho. Daftarkan dirimu
                sekarang dan mulailah perjalanan menuju karir impianmu.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/ppdb"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:brightness-110 text-white font-bold px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] group"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 0 20px ${primaryColor}66`, // 40% opacity
                  }}
                >
                  Daftar Sekarang{" "}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-full transition-all border border-white/10"
                >
                  <Phone size={18} /> Hubungi Kami
                </Link>
              </motion.div>
            </div>

            {/* Optional Decorative Illustration could go here on the right side if needed */}
            <div className="hidden lg:block relative">
              {/* Abstract shape or 3D element */}
              <div className="w-64 h-64 border-4 border-white/10 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="w-48 h-48 border-4 border-blue-500/30 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                  <div
                    className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.5)] animate-pulse"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${primaryColor}, #ffffff)`,
                      boxShadow: `0 0 50px ${primaryColor}80`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
