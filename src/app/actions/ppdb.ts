"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Form Schema
const registrationSchema = z.object({
  // 1. Informasi Pendaftaran
  jalurPendaftaran: z.string().min(1, "Jalur pendaftaran harus diisi"),
  pilihanJurusan1Id: z.string().min(1, "Pilihan jurusan 1 harus diisi"),
  pilihanJurusan2Id: z.string().optional(),
  asalSekolah: z.string().min(1, "Asal sekolah harus diisi"),
  alamatSekolah: z.string().optional(),

  // 2. Data Pribadi
  nisn: z.string().optional(),
  namaLengkap: z.string().min(1, "Nama lengkap harus diisi"),
  jenisKelamin: z.enum(["L", "P"], {
    message: "Pilih Laki-laki atau Perempuan",
  }),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  noKk: z.string().optional(),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().transform((str) => new Date(str)), // string YYYY-MM-DD -> Date
  agama: z.string().min(1, "Agama harus diisi"),

  // Alamat
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
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),

  noKip: z.string().optional(),
  noKis: z.string().optional(),

  // 3. Orang Tua
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

  // 4. Periodik/Fisik
  tinggiBadan: z.coerce.number().min(50, "Tinggi badan tidak valid").optional(),
  beratBadan: z.coerce.number().min(10, "Berat badan tidak valid").optional(),
  jumlahSaudara: z.coerce.number().min(0).optional(),

  jarakKeSekolah: z.string().optional(),
  jarakKm: z.coerce.number().optional(),
  waktuTempuh: z.string().optional(),
  transportasi: z.string().optional(),
});

export async function getMajors() {
  return await prisma.major.findMany({
    select: { id: true, name: true },
  });
}

export async function submitRegistration(prevState: any, formData: FormData) {
  try {
    // 1. Handle File Upload
    const fotoFile = formData.get("foto") as File;
    let fotoUrl = "";

    if (fotoFile && fotoFile.size > 0) {
      if (fotoFile.size > MAX_FILE_SIZE) {
        return { error: "Ukuran foto maksimal 5MB" };
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(fotoFile.type)) {
        return { error: "Format foto harus JPG, JPEG, PNG, atau WEBP" };
      }

      const bytes = await fotoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${randomUUID()}-${fotoFile.name.replace(
        /[^a-zA-Z0-9.-]/g,
        ""
      )}`;
      const uploadDir = join(process.cwd(), "public/uploads/ppdb");

      // Ensure dir exists
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), buffer);

      fotoUrl = `/uploads/ppdb/${fileName}`;
    }

    // 2. Extract Data from FormData and Validate
    const rawData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "foto") {
        rawData[key] = value;
      }
    }

    const validatedFields = registrationSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: "Validasi gagal. Cek kembali isian anda.",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const data = validatedFields.data;

    // 3. Generate Registration Number
    const count = await prisma.studentRegistration.count();
    const year = new Date().getFullYear();
    const sequence = (count + 1).toString().padStart(4, "0");
    const regNo = `PPDB-${year}-${sequence}`;

    // 4. Save to DB
    await prisma.studentRegistration.create({
      data: {
        registrationNo: regNo,
        // Spread data and ensure types match schema
        jalurPendaftaran: data.jalurPendaftaran,
        pilihanJurusan1Id: data.pilihanJurusan1Id,
        pilihanJurusan2Id: data.pilihanJurusan2Id || null, // Handle empty string as null
        asalSekolah: data.asalSekolah,
        alamatSekolah: data.alamatSekolah,

        nisn: data.nisn,
        namaLengkap: data.namaLengkap,
        jenisKelamin: data.jenisKelamin,
        nik: data.nik,
        noKk: data.noKk,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        agama: data.agama,

        alamatJalan: data.alamatJalan,
        rt: data.rt,
        rw: data.rw,
        dusun: data.dusun,
        desaKelurahan: data.desaKelurahan,
        kecamatan: data.kecamatan,
        kabupatenKota: data.kabupatenKota,
        provinsi: data.provinsi,
        kodePos: data.kodePos,

        noHp: data.noHp,
        email: data.email || null,

        noKip: data.noKip,
        noKis: data.noKis,

        namaAyah: data.namaAyah,
        nikAyah: data.nikAyah,
        tahunLahirAyah: data.tahunLahirAyah,
        pendidikanAyah: data.pendidikanAyah,
        pekerjaanAyah: data.pekerjaanAyah,
        penghasilanAyah: data.penghasilanAyah,
        noHpAyah: data.noHpAyah,

        namaIbu: data.namaIbu,
        nikIbu: data.nikIbu,
        tahunLahirIbu: data.tahunLahirIbu,
        pendidikanIbu: data.pendidikanIbu,
        pekerjaanIbu: data.pekerjaanIbu,
        penghasilanIbu: data.penghasilanIbu,
        noHpIbu: data.noHpIbu,

        namaWali: data.namaWali,
        pekerjaanWali: data.pekerjaanWali,
        penghasilanWali: data.penghasilanWali,
        noHpWali: data.noHpWali,

        tinggiBadan: data.tinggiBadan,
        beratBadan: data.beratBadan,
        jumlahSaudara: data.jumlahSaudara,

        jarakKeSekolah: data.jarakKeSekolah,
        jarakKm: data.jarakKm,
        waktuTempuh: data.waktuTempuh,
        transportasi: data.transportasi,

        fotoUrl: fotoUrl || null,
      },
    });

    return { success: true, registrationNo: regNo };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
    };
  }
}

export async function updateRegistrationStatus(
  id: string,
  status: "VERIFIED" | "ACCEPTED" | "REJECTED" | "PENDING"
) {
  try {
    await prisma.studentRegistration.update({
      where: { id },
      data: { status },
    });
    return { success: true };
  } catch (error) {
    console.error("Update status error:", error);
    return { error: "Gagal mengupdate status" };
  }
}
