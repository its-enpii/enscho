import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 py-16 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Profil Sekolah
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Mengenal lebih dekat SMK Enscho sebagai lembaga pendidikan vokasi
            terdepan.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Sejarah Singkat
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Berdiri sejak tahun 2010, SMK Enscho telah meluluskan ribuan
              alumni yang tersebar di berbagai perusahaan multinasional.
              Dedikasi kami pada kualitas pendidikan dan pembentukan karakter
              menjadi fondasi utama.
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Visi Kami
            </h2>
            <blockquote className="text-xl italic text-slate-700 border-l-4 border-blue-500 pl-4 mb-6">
              "Menjadi SMK Pusat Keunggulan yang menghasilkan tamatan kompeten,
              berakhlak mulia, dan berwawasan global."
            </blockquote>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Sambutan Kepala Sekolah",
                href: "/profil/sambutan",
                icon: Users,
              },
              {
                title: "Struktur Organisasi",
                href: "/profil/struktur",
                icon: BookOpen,
              },
              { title: "Guru & Staf", href: "/profil/guru", icon: Users },
              {
                title: "Sarana Prasarana",
                href: "/profil/sarpras",
                icon: BookOpen,
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <item.icon
                  className="text-slate-400 group-hover:text-blue-500 mb-3"
                  size={32}
                />
                <span className="font-semibold text-slate-800 text-center">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
