"use client";

import { LogIn, Award, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function AlumniLoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-blue-200">
            <Award size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Akses Alumni
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Terhubung kembali dengan almamater, akses database alumni, dan info
            karir.
          </p>
        </div>

        <form className="mt-8 space-y-6" action={action}>
          <input type="hidden" name="targetRole" value="ALUMNI" />
          <div className="rounded-md space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email Alumni
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-600"
              >
                Simpan sandi
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-900 transition-colors"
              >
                Lupa sandi?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn
                  className="h-5 w-5 text-blue-400 group-hover:text-blue-300"
                  aria-hidden="true"
                />
              </span>
              {isPending ? "Sedang Masuk..." : "Masuk Alumni"}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Belum terdaftar?{" "}
            <Link
              href="/kontak"
              className="font-bold text-blue-900 hover:underline"
            >
              Hubungi BKK
            </Link>
          </p>
          <Link
            href="/"
            className="text-xs text-blue-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <ArrowRight size={12} className="rotate-180" /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-1 text-[10px] text-slate-300 uppercase font-bold tracking-widest mt-2">
            Proud Alumni{" "}
            <Heart size={10} className="fill-red-400 text-red-400" /> SMK Enscho
          </div>
        </div>
      </motion.div>
    </div>
  );
}
