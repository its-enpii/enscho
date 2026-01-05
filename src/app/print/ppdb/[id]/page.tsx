import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function PrintPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  // Try to find by ID (admin usage) or Registration Number (public usage)
  let registration = await prisma.studentRegistration.findUnique({
    where: { id: params.id },
    include: { pilihanJurusan1: true, pilihanJurusan2: true },
  });

  if (!registration) {
    registration = await prisma.studentRegistration.findUnique({
      where: { registrationNo: params.id },
      include: { pilihanJurusan1: true, pilihanJurusan2: true },
    });
  }

  if (!registration) {
    notFound();
  }

  // Get school config for header (hardcoded fallback for now if no config exists)
  const schoolName = "SMK ENSCHO";
  const schoolAddress = "Jl. Pendidikan No. 1, Jakarta Selatan";
  const schoolPhone = "(021) 1234567";
  const schoolEmail = "info@enscho.sch.id";

  const DataItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | null | undefined | number;
  }) => (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-1 w-[35%] font-medium text-gray-700 align-top">
        {label}
      </td>
      <td className="py-2 px-1 w-[5%] align-top">:</td>
      <td className="py-2 px-1 w-[60%] font-bold text-gray-900 align-top">
        {value || "-"}
      </td>
    </tr>
  );

  return (
    <div className="bg-white text-black text-[12px] leading-tight">
      <style>{`
        @media print {
          @page { size: A4; margin: 1cm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none; }
          .print-container { padding: 0 !important; width: 100%; max-width: none; }
          h1 { font-size: 16pt !important; }
          h2 { font-size: 20pt !important; }
          h3 { font-size: 14pt !important; }
          td { padding-top: 2px !important; padding-bottom: 2px !important; }
        }
      `}</style>

      <div className="max-w-[21cm] mx-auto p-10 print:p-0 print-container">
        {/* Print Button (Visible only on screen) */}
        <div className="mb-8 flex justify-end no-print">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors print-btn">
            Print Dokumen
          </button>
          <script
            dangerouslySetInnerHTML={{
              __html: `document.querySelector('.print-btn').onclick = () => window.print();`,
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-6 border-b-4 border-black pb-4 mb-8">
          <div className="w-24 h-24 relative flex-shrink-0">
            {/* Ideally fetch logo from school config */}
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center font-bold text-2xl">
              E
            </div>
          </div>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-black uppercase tracking-wider mb-1">
              Panitia Penerimaan Peserta Didik Baru
            </h1>
            <h2 className="text-3xl font-black uppercase text-blue-900 mb-2">
              {schoolName}
            </h2>
            <p className="text-sm font-medium">{schoolAddress}</p>
            <p className="text-sm font-medium">
              Telp: {schoolPhone} | Email: {schoolEmail}
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-bold uppercase underline decoration-2 underline-offset-4">
            Bukti Pendaftaran Siswa Baru
          </h3>
          <p className="text-sm font-mono mt-1">
            No. Registrasi:{" "}
            <span className="font-bold text-base">
              {registration.registrationNo}
            </span>
          </p>
        </div>

        <div className="flex gap-6 mb-6">
          {/* Photo */}
          <div className="w-32 flex-shrink-0">
            <div className="w-28 h-36 bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden">
              {registration.fotoUrl ? (
                <Image
                  src={registration.fotoUrl}
                  width={112}
                  height={144}
                  alt="Pas Foto"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xs text-gray-400 text-center px-2">
                  3x4
                </span>
              )}
            </div>
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <table className="w-full text-sm">
              <tbody>
                <DataItem
                  label="Nama Lengkap"
                  value={registration.namaLengkap}
                />
                <DataItem label="NISN" value={registration.nisn} />
                <DataItem
                  label="Jalur Pendaftaran"
                  value={registration.jalurPendaftaran}
                />
                <DataItem
                  label="Pilihan Jurusan 1"
                  value={registration.pilihanJurusan1.name}
                />
                <DataItem
                  label="Pilihan Jurusan 2"
                  value={registration.pilihanJurusan2?.name}
                />
                <DataItem
                  label="Asal Sekolah"
                  value={registration.asalSekolah}
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h4 className="font-bold border-b border-black mb-2 pb-1 text-sm">
              Data Pribadi
            </h4>
            <table className="w-full text-xs">
              <tbody>
                <DataItem
                  label="Tempat Lahir"
                  value={registration.tempatLahir}
                />
                <DataItem
                  label="Tanggal Lahir"
                  value={new Date(registration.tanggalLahir).toLocaleDateString(
                    "id-ID"
                  )}
                />
                <DataItem
                  label="Jenis Kelamin"
                  value={
                    registration.jenisKelamin === "L"
                      ? "Laki-laki"
                      : "Perempuan"
                  }
                />
                <DataItem label="Agama" value={registration.agama} />
                <DataItem label="No. HP" value={registration.noHp} />
              </tbody>
            </table>
          </div>
          <div>
            <h4 className="font-bold border-b border-black mb-2 pb-1 text-sm">
              Alamat
            </h4>
            <p className="text-xs font-bold text-gray-900 leading-relaxed">
              {registration.alamatJalan}, RT {registration.rt || "-"}/RW{" "}
              {registration.rw || "-"},
              {registration.dusun ? ` Dsn. ${registration.dusun},` : ""}
              Ds. {registration.desaKelurahan}, Kec. {registration.kecamatan},
              {registration.kabupatenKota}, {registration.provinsi}{" "}
              {registration.kodePos}
            </p>
          </div>
        </div>

        {/* Parents */}
        <div className="mb-8">
          <h4 className="font-bold border-b border-black mb-2 pb-1 text-sm">
            Data Orang Tua
          </h4>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-1 w-[35%] font-medium text-gray-700">
                  Nama Ayah / Ibu
                </td>
                <td className="py-1 w-[5%]">:</td>
                <td className="py-1 w-[60%] font-bold text-gray-900">
                  {registration.namaAyah} / {registration.namaIbu}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1 font-medium text-gray-700">
                  No. HP Orang Tua
                </td>
                <td className="py-1">:</td>
                <td className="py-1 font-bold text-gray-900">
                  {registration.noHpAyah || "-"} / {registration.noHpIbu || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature */}
        <div className="flex justify-between items-end mt-12 px-8">
          <div className="text-center w-48">
            <p className="text-xs mb-12">Siswa Pendaftar,</p>
            <p className="font-bold underline text-sm">
              ({registration.namaLengkap})
            </p>
          </div>
          <div className="text-center w-48">
            <p className="text-xs mb-1">
              Jakarta,{" "}
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs mb-12">Panitia PPDB,</p>
            <p className="font-bold underline text-sm">
              (...................................)
            </p>
          </div>
        </div>

        <div className="mt-8 pt-2 border-t border-dashed border-gray-400 text-[10px] text-center text-gray-500 italic">
          Dokumen ini dicetak otomatis melalui sistem PPDB Online Enscho. Harap
          dibawa saat verifikasi berkas.
        </div>
      </div>
    </div>
  );
}
