import RegistrationForm from "@/components/ppdb/RegistrationForm";
import { getMajors } from "@/app/actions/ppdb";

export const metadata = {
  title: "Pendaftaran Siswa Baru (PPDB) - SMK Enscho",
  description:
    "Formulir penerimaan peserta didik baru SMK Enscho Tahun Pelajaran 2026/2027.",
};

export default async function PPDBPage() {
  const majors = await getMajors();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Penerimaan Peserta Didik Baru
          </h1>
          <p className="text-blue-100 text-lg md:text-xl">
            Tahun Pelajaran 2026/2027
          </p>
          <p className="mt-4 text-blue-200 text-sm">
            Mari bergabung mencetak generasi unggul, berkarakter, dan kompeten.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <RegistrationForm majors={majors} />
      </div>
    </div>
  );
}
