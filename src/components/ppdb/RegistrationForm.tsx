"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { submitRegistration } from "@/app/actions/ppdb";
import { Loader2, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

// Duplicate Schema for Client Validation (Synced with Server)
// Ideally shared, but inline for now
const registrationSchema = z.object({
  jalurPendaftaran: z.string().min(1, "Jalur pendaftaran harus diisi"),
  pilihanJurusan1Id: z.string().min(1, "Pilihan jurusan 1 harus diisi"),
  pilihanJurusan2Id: z.string().optional(),
  asalSekolah: z.string().min(1, "Asal sekolah harus diisi"),
  alamatSekolah: z.string().optional(),

  nisn: z.string().optional(),
  namaLengkap: z.string().min(1, "Nama lengkap harus diisi"),
  jenisKelamin: z.string().min(1, "Pilih Laki-laki atau Perempuan"),
  nik: z.string().length(16, "NIK harus 16 digit"),
  noKk: z.string().optional(),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"), // Input type date returns string
  agama: z.string().min(1, "Agama harus diisi"),

  alamatJalan: z.string().min(1, "Alamat jalan harus diisi"),
  rt: z.string().optional(),
  rw: z.string().optional(),
  dusun: z.string().optional(),
  desaKelurahan: z.string().min(1, "Desa/Kelurahan harus diisi"),
  kecamatan: z.string().min(1, "Kecamatan harus diisi"),
  kabupatenKota: z.string().min(1, "Kabupaten/Kota harus diisi"),
  provinsi: z.string().min(1, "Provinsi harus diisi"),
  kodePos: z.string().min(5, "Kode Pos minimal 5 digit"),

  noHp: z.string().min(1, "Nomor HP harus diisi"),
  email: z.string().optional(),

  noKip: z.string().optional(),
  noKis: z.string().optional(),

  namaAyah: z.string().min(1, "Nama ayah harus diisi"),
  nikAyah: z.string().optional(),
  tahunLahirAyah: z.string().optional(),
  pendidikanAyah: z.string().optional(),
  pekerjaanAyah: z.string().optional(),
  penghasilanAyah: z.string().optional(),
  noHpAyah: z.string().optional(),

  namaIbu: z.string().min(1, "Nama ibu harus diisi"),
  nikIbu: z.string().optional(),
  tahunLahirIbu: z.string().optional(),
  pendidikanIbu: z.string().optional(),
  pekerjaanIbu: z.string().optional(),
  penghasilanIbu: z.string().optional(),
  noHpIbu: z.string().optional(),

  namaWali: z.string().optional(),
  pekerjaanWali: z.string().optional(),
  penghasilanWali: z.string().optional(),
  noHpWali: z.string().optional(),

  tinggiBadan: z.coerce.number().min(50).optional(),
  beratBadan: z.coerce.number().min(10).optional(),
  jumlahSaudara: z.coerce.number().min(0).optional(),

  jarakKeSekolah: z.string().optional(),
  jarakKm: z.coerce.number().optional(),
  waktuTempuh: z.string().optional(),
  transportasi: z.string().optional(),
});

type FormData = z.infer<typeof registrationSchema>;

interface Major {
  id: string;
  name: string;
}

export default function RegistrationForm({ majors }: { majors: Major[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      jarakKeSekolah: "Kurang dari 1 km",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      // Append all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append file
      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      const result = await submitRegistration(null, formData);

      if (result?.error) {
        setError(result.error);
        if (result.fieldErrors) {
          console.error("Field Validation Errors:", result.fieldErrors);
        }
      } else if (result?.success) {
        router.push(`/ppdb/success?regNo=${result.registrationNo}`);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6 mt-8">
      {children}
    </h3>
  );

  const InputGroup = ({ label, error, required, children }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-900 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );

  const Input = ({
    label,
    name,
    type = "text",
    placeholder,
    required,
    ...props
  }: any) => (
    <InputGroup
      label={label}
      error={errors[name as keyof FormData]}
      required={required}
    >
      <input
        {...register(name as any)}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        {...props}
      />
    </InputGroup>
  );

  const Select = ({
    label,
    name,
    options,
    required,
    placeholder = "Pilih...",
  }: any) => (
    <InputGroup
      label={label}
      error={errors[name as keyof FormData]}
      required={required}
    >
      <select
        {...register(name as any)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </InputGroup>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 text-red-700 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-blue-50 p-6 rounded-xl mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">
          Formulir Pendaftaran Siswa Baru
        </h2>
        <p className="text-blue-600">
          Mohon isi data dengan lengkap dan benar sesuai dokumen asli
          (Ijazah/KK/Akte).
        </p>
      </div>

      {/* 1. INFORMASI PENDAFTARAN */}
      <SectionTitle>1. Informasi Pendaftaran</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Jalur Pendaftaran"
          name="jalurPendaftaran"
          required
          options={[
            { value: "Reguler", label: "Reguler" },
            { value: "Prestasi", label: "Prestasi" },
            { value: "Afirmasi", label: "Afirmasi / KETM" },
            { value: "Pindahan", label: "Pindahan" },
          ]}
        />
        <Input
          label="Asal Sekolah (SMP/MTs)"
          name="asalSekolah"
          required
          placeholder="Contoh: SMPN 1 Jakarta"
        />
        <Select
          label="Pilihan Jurusan 1"
          name="pilihanJurusan1Id"
          required
          options={majors.map((m) => ({ value: m.id, label: m.name }))}
        />
        <Select
          label="Pilihan Jurusan 2 (Opsional)"
          name="pilihanJurusan2Id"
          options={majors.map((m) => ({ value: m.id, label: m.name }))}
        />
      </div>

      {/* 2. DATA PRIBADI */}
      <SectionTitle>2. Data Pribadi Calon Siswa</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nama Lengkap"
          name="namaLengkap"
          required
          placeholder="Sesuai Ijazah"
        />
        <Input label="NISN" name="nisn" placeholder="10 Digit Angka" />
        <Input
          label="NIK / No. KTP"
          name="nik"
          required
          placeholder="16 Digit Angka"
          maxLength={16}
        />
        <Input
          label="No. KK"
          name="noKk"
          placeholder="16 Digit Angka"
          maxLength={16}
        />

        <Select
          label="Jenis Kelamin"
          name="jenisKelamin"
          required
          options={[
            { value: "L", label: "Laki-laki" },
            { value: "P", label: "Perempuan" },
          ]}
        />
        <Select
          label="Agama"
          name="agama"
          required
          options={[
            { value: "Islam", label: "Islam" },
            { value: "Kristen", label: "Kristen" },
            { value: "Katolik", label: "Katolik" },
            { value: "Hindu", label: "Hindu" },
            { value: "Buddha", label: "Buddha" },
            { value: "Konghucu", label: "Konghucu" },
          ]}
        />

        <Input label="Tempat Lahir" name="tempatLahir" required />
        <Input label="Tanggal Lahir" name="tanggalLahir" type="date" required />

        <Input
          label="No. Handphone (WA)"
          name="noHp"
          required
          placeholder="08..."
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="nama@email.com"
        />
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 mb-3">Alamat Lengkap</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Alamat Jalan"
              name="alamatJalan"
              required
              placeholder="Nama Jalan, Gg, No. Rumah"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="RT" name="rt" placeholder="001" />
            <Input label="RW" name="rw" placeholder="002" />
          </div>
          <Input label="Dusun / Lingkungan" name="dusun" />
          <Input label="Desa / Kelurahan" name="desaKelurahan" required />
          <Input label="Kecamatan" name="kecamatan" required />
          <Input label="Kabupaten / Kota" name="kabupatenKota" required />
          <Input label="Provinsi" name="provinsi" required />
          <Input label="Kode Pos" name="kodePos" required />
        </div>
      </div>

      {/* 3. DATA ORANG TUA */}
      <SectionTitle>3. Data Orang Tua / Wali</SectionTitle>

      {/* Ayah */}
      <div className="mb-6 border p-4 rounded-xl bg-gray-50">
        <h4 className="font-bold text-gray-800 mb-4">Data Ayah Kandung</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nama Ayah" name="namaAyah" required />
          <Input
            label="NIK Ayah"
            name="nikAyah"
            placeholder="16 Digit"
            maxLength={16}
          />
          <Input
            label="Tahun Lahir"
            name="tahunLahirAyah"
            placeholder="YYYY"
            maxLength={4}
          />
          <Input label="Pekerjaan" name="pekerjaanAyah" />
          <Select
            label="Penghasilan Bulanan"
            name="penghasilanAyah"
            options={[
              { value: "Kurang dari 500.000", label: "< Rp 500.000" },
              { value: "500.000 - 1.000.000", label: "Rp 500.000 - 1 Juta" },
              { value: "1.000.000 - 2.000.000", label: "Rp 1 Juta - 2 Juta" },
              { value: "2.000.000 - 5.000.000", label: "Rp 2 Juta - 5 Juta" },
              { value: "Lebih dari 5.000.000", label: "> Rp 5 Juta" },
            ]}
          />
          <Input label="No. HP Ayah" name="noHpAyah" />
        </div>
      </div>

      {/* Ibu */}
      <div className="mb-6 border p-4 rounded-xl bg-gray-50">
        <h4 className="font-bold text-gray-800 mb-4">Data Ibu Kandung</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nama Ibu" name="namaIbu" required />
          <Input
            label="NIK Ibu"
            name="nikIbu"
            placeholder="16 Digit"
            maxLength={16}
          />
          <Input
            label="Tahun Lahir"
            name="tahunLahirIbu"
            placeholder="YYYY"
            maxLength={4}
          />
          <Input label="Pekerjaan" name="pekerjaanIbu" />
          <Select
            label="Penghasilan Bulanan"
            name="penghasilanIbu"
            options={[
              { value: "Tidak Berpenghasilan", label: "Tidak Berpenghasilan" },
              { value: "Kurang dari 500.000", label: "< Rp 500.000" },
              { value: "500.000 - 1.000.000", label: "Rp 500.000 - 1 Juta" },
              { value: "Lebih dari 1.000.000", label: "> Rp 1 Juta" },
            ]}
          />
          <Input label="No. HP Ibu" name="noHpIbu" />
        </div>
      </div>

      {/* 4. DATA PERIODIK */}
      <SectionTitle>4. Data Periodik</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Tinggi Badan (cm)"
          name="tinggiBadan"
          type="number"
          placeholder="165"
        />
        <Input
          label="Berat Badan (kg)"
          name="beratBadan"
          type="number"
          placeholder="55"
        />
        <Input
          label="Jumlah Saudara Kandung"
          name="jumlahSaudara"
          type="number"
          placeholder="2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Jarak Tempat Tinggal ke Sekolah
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Kurang dari 1 km"
                {...register("jarakKeSekolah")}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-900">Kurang dari 1 km</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Lebih dari 1 km"
                {...register("jarakKeSekolah")}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-900">Lebih dari 1 km</span>
            </label>
          </div>
        </div>
        <Input
          label="Sebutkan Jarak (km)"
          name="jarakKm"
          type="number"
          step="0.1"
          placeholder="Contoh: 2.5"
        />
        <Input
          label="Waktu Tempuh"
          name="waktuTempuh"
          placeholder="Contoh: 15 menit"
        />
        <Select
          label="Transportasi Ke Sekolah"
          name="transportasi"
          options={[
            { value: "Jalan Kaki", label: "Jalan Kaki" },
            { value: "Sepeda", label: "Sepeda" },
            { value: "Sepeda Motor", label: "Sepeda Motor" },
            { value: "Antar Jemput", label: "Antar Jemput" },
            { value: "Angkutan Umum", label: "Angkutan Umum" },
            { value: "Lainnya", label: "Lainnya" },
          ]}
        />
      </div>

      {/* UPLOAD FOTO */}
      <SectionTitle>5. Upload Foto</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Pas Foto Terbaru (Formal / Seragam SMP)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm font-medium">Klik untuk upload foto</p>
              <p className="text-xs text-gray-400 mt-1">
                Maksimal 5MB, JPG/PNG
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Preview Foto
          </p>
          {fotoPreview ? (
            <div className="relative w-32 h-40 bg-gray-100 rounded-lg overflow-hidden border shadow-sm">
              <Image
                src={fotoPreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-40 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs text-center p-2">
              Belum ada foto
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 border-t pt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto md:min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Menyimpan...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Kirim Pendaftaran
            </>
          )}
        </button>
      </div>
    </form>
  );
}
