import RegistrationForm from "@/components/ppdb/RegistrationForm";
import { getMajors } from "@/app/actions/ppdb";

export async function generateMetadata() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startYear = month >= 6 ? year + 1 : year; // If July-Dec, assumes next year admission
  const schoolYear = `${startYear}/${startYear + 1}`;

  return {
    title: "Pendaftaran Siswa Baru (PPDB) - SMK Enscho",
    description: `Formulir penerimaan peserta didik baru SMK Enscho Tahun Pelajaran ${schoolYear}.`,
  };
}

export default async function PPDBPage() {
  const majors = await getMajors();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startYear = month >= 6 ? year + 1 : year;
  const schoolYear = `${startYear}/${startYear + 1}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2000')",
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Penerimaan Peserta Didik Baru
          </h1>
          <p className="text-blue-100 text-lg md:text-xl">
            Tahun Pelajaran {schoolYear}
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
