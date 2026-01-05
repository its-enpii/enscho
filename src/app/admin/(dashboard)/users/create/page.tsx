import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import bcrypt from "bcryptjs";

export default function CreateUserPage() {
  async function createUser(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    // Basic validation
    if (!email || !password) {
      throw new Error("Email dan password harus diisi");
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role as any,
      },
    });

    revalidatePath("/admin/users");
    redirect("/admin/users");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Pengguna
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          Tambah Pengguna Baru
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Buat akun pengguna baru untuk sistem
        </p>
      </div>

      <form
        action={createUser}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            placeholder="Masukkan nama lengkap"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Opsional - bisa diisi nanti
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="nama@example.com"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Email akan digunakan untuk login
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="Minimal 6 karakter"
            minLength={6}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">Minimal 6 karakter</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Role / Peran <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            required
            defaultValue="STUDENT"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ADMIN">Administrator - Akses penuh ke sistem</option>
            <option value="TEACHER">Guru - Dapat mengelola konten</option>
            <option value="STUDENT">Siswa - Akses terbatas</option>
            <option value="ALUMNI">Alumni - Akses terbatas</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Tentukan level akses pengguna
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Simpan Pengguna
            </button>
            <Link
              href="/admin/users"
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
          </div>
        </div>
      </form>

      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-sm text-emerald-800">
          <strong>Catatan Keamanan:</strong> Password kini disimpan dalam bentuk
          hash (bcrypt) yang aman. Password akan otomatis dienkripsi sebelum
          disimpan ke database.
        </p>
      </div>
    </div>
  );
}
