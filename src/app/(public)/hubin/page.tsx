import { Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export default function HubinPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-900 py-16 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hubungan Industri & BKK
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Jembatan antara dunia pendidikan dan dunia kerja. Kami memastikan
            lulusan terserap di industri.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mitra Industri Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Mitra Industri
              </h2>
            </div>
            <p className="text-slate-600 mb-6">
              Kami bekerjasama dengan lebih dari 50 perusahaan ternama untuk
              program Praktik Kerja Industri (Prakerin), Guru Tamu, dan
              Rekrutmen Tenaga Kerja.
            </p>
            <Link
              href="/hubin/mitra"
              className="text-blue-600 font-semibold hover:underline"
            >
              Lihat Daftar Mitra &rarr;
            </Link>
          </div>

          {/* Loker Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Bursa Kerja Khusus (BKK)
              </h2>
            </div>
            <p className="text-slate-600 mb-6">
              Dapatkan informasi lowongan kerja terbaru khusus untuk alumni dan
              siswa tingkat akhir. Update setiap minggu!
            </p>
            <Link
              href="/hubin/loker"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Cek Lowongan Kerja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
