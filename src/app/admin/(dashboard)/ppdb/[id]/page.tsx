import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Printer,
  FileText,
} from "lucide-react";
import { updateRegistrationStatus } from "@/app/actions/ppdb";
import { redirect } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PPDBDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const registration = await prisma.studentRegistration.findUnique({
    where: { id: params.id },
    include: {
      pilihanJurusan1: true,
      pilihanJurusan2: true,
    },
  });

  if (!registration) {
    return <div>Data tidak ditemukan</div>;
  }

  async function updateStatus(formData: FormData) {
    "use server";
    const newStatus = formData.get("status") as any;
    await updateRegistrationStatus(params.id, newStatus);
    redirect(`/admin/ppdb/${params.id}`);
  }

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | null | undefined | number;
  }) => (
    <div className="flex border-b border-gray-100 py-3 last:border-0 hover:bg-gray-50 px-2 rounded-sm transition-colors">
      <span className="w-1/3 text-gray-500 font-medium">{label}</span>
      <span className="w-2/3 text-gray-900 font-semibold break-words">
        {value || "-"}
      </span>
    </div>
  );

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-bold text-gray-800 flex items-center gap-2">
        <FileText size={18} className="text-blue-600" />
        {title}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/ppdb"
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Pendaftaran
            </h1>
            <p className="text-gray-500">
              No. Reg:{" "}
              <span className="font-mono font-bold text-blue-600">
                {registration.registrationNo}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex gap-2">
            <Link
              href={`/print/ppdb/${registration.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm font-medium"
            >
              <Printer size={18} />
              Cetak Formulir
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Data Pribadi Siswa">
            <div className="flex flex-col gap-4">
              {registration.fotoUrl && (
                <div className="mb-4">
                  <span className="block text-sm text-gray-500 mb-2">
                    Pas Foto
                  </span>
                  <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden relative border shadow-sm">
                    <Image
                      src={registration.fotoUrl}
                      alt="Foto siswa"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <InfoRow label="Nama Lengkap" value={registration.namaLengkap} />
              <InfoRow label="NISN" value={registration.nisn} />
              <InfoRow label="NIK" value={registration.nik} />
              <InfoRow label="No. KK" value={registration.noKk} />
              <InfoRow
                label="Jenis Kelamin"
                value={
                  registration.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"
                }
              />
              <InfoRow
                label="Tempat, Tanggal Lahir"
                value={`${registration.tempatLahir}, ${new Date(
                  registration.tanggalLahir
                ).toLocaleDateString("id-ID")}`}
              />
              <InfoRow label="Agama" value={registration.agama} />
              <InfoRow label="No. HP" value={registration.noHp} />
              <InfoRow label="Email" value={registration.email} />
              <InfoRow
                label="KIP / KIS"
                value={`${registration.noKip || "-"} / ${
                  registration.noKis || "-"
                }`}
              />
            </div>
          </SectionCard>

          <SectionCard title="Alamat Tempat Tinggal">
            <InfoRow label="Jalan" value={registration.alamatJalan} />
            <InfoRow
              label="RT / RW"
              value={`${registration.rt || "-"} / ${registration.rw || "-"}`}
            />
            <InfoRow label="Dusun / Lingkungan" value={registration.dusun} />
            <InfoRow
              label="Desa / Kelurahan"
              value={registration.desaKelurahan}
            />
            <InfoRow label="Kecamatan" value={registration.kecamatan} />
            <InfoRow
              label="Kabupaten / Kota"
              value={registration.kabupatenKota}
            />
            <InfoRow label="Provinsi" value={registration.provinsi} />
            <InfoRow label="Kode Pos" value={registration.kodePos} />
            <InfoRow
              label="Jarak ke Sekolah"
              value={`${registration.jarakKeSekolah} (${
                registration.jarakKm || 0
              } km)`}
            />
            <InfoRow label="Waktu Tempuh" value={registration.waktuTempuh} />
            <InfoRow label="Transportasi" value={registration.transportasi} />
          </SectionCard>

          <SectionCard title="Data Orang Tua & Wali">
            <h4 className="font-bold text-gray-900 border-b pb-2 mb-3 mt-1">
              Ayah Kandung
            </h4>
            <InfoRow label="Nama" value={registration.namaAyah} />
            <InfoRow label="NIK" value={registration.nikAyah} />
            <InfoRow label="Tahun Lahir" value={registration.tahunLahirAyah} />
            <InfoRow label="Pekerjaan" value={registration.pekerjaanAyah} />
            <InfoRow label="Penghasilan" value={registration.penghasilanAyah} />
            <InfoRow label="No. HP" value={registration.noHpAyah} />

            <h4 className="font-bold text-gray-900 border-b pb-2 mb-3 mt-6">
              Ibu Kandung
            </h4>
            <InfoRow label="Nama" value={registration.namaIbu} />
            <InfoRow label="NIK" value={registration.nikIbu} />
            <InfoRow label="Tahun Lahir" value={registration.tahunLahirIbu} />
            <InfoRow label="Pekerjaan" value={registration.pekerjaanIbu} />
            <InfoRow label="Penghasilan" value={registration.penghasilanIbu} />
            <InfoRow label="No. HP" value={registration.noHpIbu} />

            {registration.namaWali && (
              <>
                <h4 className="font-bold text-gray-900 border-b pb-2 mb-3 mt-6">
                  Wali
                </h4>
                <InfoRow label="Nama" value={registration.namaWali} />
                <InfoRow label="Pekerjaan" value={registration.pekerjaanWali} />
                <InfoRow
                  label="Penghasilan"
                  value={registration.penghasilanWali}
                />
                <InfoRow label="No. HP" value={registration.noHpWali} />
              </>
            )}
          </SectionCard>
        </div>

        {/* Sidebar / Status Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">
              Status Pendaftaran
            </h3>

            <div
              className={`p-4 rounded-lg mb-6 text-center border-2 ${
                registration.status === "ACCEPTED"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : registration.status === "REJECTED"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : registration.status === "VERIFIED"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-yellow-50 border-yellow-200 text-yellow-700"
              }`}
            >
              <span className="block text-sm font-medium uppercase tracking-wider mb-1">
                Status Saat Ini
              </span>
              <span className="text-2xl font-black">{registration.status}</span>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Ubah Status:</p>

              <form action={updateStatus}>
                <input type="hidden" name="status" value="VERIFIED" />
                <button className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 rounded-lg transition-colors">
                  <CheckCircle size={18} />
                  Verifikasi Berkas
                </button>
              </form>

              <div className="grid grid-cols-2 gap-3">
                <form action={updateStatus} className="w-full">
                  <input type="hidden" name="status" value="ACCEPTED" />
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    Diterima
                  </button>
                </form>
                <form action={updateStatus} className="w-full">
                  <input type="hidden" name="status" value="REJECTED" />
                  <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 rounded-lg transition-colors">
                    Ditolak
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Informasi Pilihan</h3>
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Jalur Pendaftaran
                </span>
                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  {registration.jalurPendaftaran}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Pilihan Jurusan 1
                </span>
                <span className="font-bold text-blue-700 text-lg block border-l-4 border-blue-600 pl-3">
                  {registration.pilihanJurusan1.name}
                </span>
              </div>
              {registration.pilihanJurusan2 && (
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Pilihan Jurusan 2
                  </span>
                  <span className="font-bold text-gray-700 text-md block border-l-4 border-gray-300 pl-3">
                    {registration.pilihanJurusan2.name}
                  </span>
                </div>
              )}
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Asal Sekolah
                </span>
                <span className="font-semibold text-gray-900">
                  {registration.asalSekolah}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {registration.alamatSekolah}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
