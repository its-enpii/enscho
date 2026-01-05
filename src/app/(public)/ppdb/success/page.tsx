import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DownloadRegistrationPdfButton from "@/components/ppdb/DownloadPdfButton";

export default async function PPDBSuccessPage(props: {
  searchParams?: Promise<{ regNo?: string }>;
}) {
  const searchParams = await props.searchParams;
  const regNo = searchParams?.regNo || "-";

  // Fetch full data for the PDF
  const registration = await prisma.studentRegistration.findUnique({
    where: { registrationNo: regNo },
    include: { pilihanJurusan1: true, pilihanJurusan2: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center border-t-8 border-green-500">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pendaftaran Berhasil!
        </h1>
        <p className="text-gray-600 mb-6">
          Terima kasih telah mendaftar. Data pendaftaran Anda telah kami terima
          dan akan segera diproses oleh panitia.
        </p>

        <div className="bg-gray-100 p-4 rounded-xl mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Nomor Registrasi Anda
          </p>
          <p className="text-3xl font-mono font-bold text-blue-700">{regNo}</p>
        </div>

        <div className="flex flex-col gap-3">
          {registration ? (
            <DownloadRegistrationPdfButton data={registration} />
          ) : (
            <p className="text-sm text-red-500">
              Gagal memuat data PDF. Silakan hubungi admin.
            </p>
          )}

          <Link
            href="/"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg border border-gray-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Silakan simpan nomor registrasi Anda untuk pengecekan status
          selanjutnya. Hubungi panitia jika ada pertanyaan.
        </p>
      </div>
    </div>
  );
}
