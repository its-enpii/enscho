"use client";

import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Building2,
  Users2,
  Trophy,
  Lightbulb,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export function FeatureSection({ features }: { features: Feature[] }) {
  if (features.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 font-bold uppercase tracking-wider text-sm bg-blue-50 px-4 py-2 rounded-full"
          >
            Kenapa Memilih Kami?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mt-6 mb-6"
          >
            Keunggulan SMK Enscho
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg"
          >
            Kami berkomitmen memberikan pendidikan kualitas terbaik dengan
            lingkungan belajar yang mendukung pertumbuhan holistik setiap siswa.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            // Dynamic Icon
            // @ts-ignore
            const Icon = LucideIcons[feature.icon] || LucideIcons.Award;

            // Map color names to Tailwind gradient classes
            const colorMap: Record<string, string> = {
              blue: "bg-gradient-to-br from-blue-500 to-blue-600",
              purple: "bg-gradient-to-br from-purple-500 to-purple-600",
              green: "bg-gradient-to-br from-green-500 to-green-600",
              amber: "bg-gradient-to-br from-amber-500 to-amber-600",
              red: "bg-gradient-to-br from-red-500 to-red-600",
              cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600",
            };

            const gradientClass =
              colorMap[feature.color] ||
              "bg-gradient-to-br from-blue-500 to-blue-600";

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${gradientClass}`}
                >
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
