import { SCHOOL_INFO } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-blue-900 py-16 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hubungi Kami
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Kami siap melayani kebutuhan informasi Anda. Silakan hubungi kami
            melalui kontak di bawah ini atau kirim pesan.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Alamat Sekolah
              </h3>
              <p className="text-slate-600">{SCHOOL_INFO.address}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Telepon / WhatsApp
              </h3>
              <p className="text-slate-600">{SCHOOL_INFO.phone}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Email</h3>
              <p className="text-slate-600">{SCHOOL_INFO.email}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Kirim Pesan
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Judul Pesan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
