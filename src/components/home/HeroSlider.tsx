import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSlider({ bannerUrl }: { bannerUrl?: string | null }) {
  const bgImage = bannerUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop';
  
  return (
    <div className="relative bg-slate-900 border-b border-slate-800 h-[500px] sm:h-[600px] flex items-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-900/40 z-10" />
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl text-white">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-sm font-semibold mb-6">
              Penerimaan Peserta Didik Baru (PPDB) 2026/2027 Dibuka!
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Siap Kerja, Santun, <br/>
              <span className="text-blue-500">Kreatif & Berinovasi</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Membangun generasi emas melalui pendidikan vokasi berkualitas, 
              didukung fasilitas modern dan kerjasama industri yang luas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/ppdb" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg hover:shadow-blue-500/25"
              >
                Daftar Sekarang <ArrowRight size={18} />
              </Link>
              <Link 
                href="/profil" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 hover:text-white text-slate-200 backdrop-blur-sm border border-white/10 font-semibold px-8 py-3.5 rounded-full transition-all"
              >
                Profil Sekolah
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
