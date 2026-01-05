import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  async function updateUser(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    // Check if email is taken by another user
    if (email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        throw new Error("Email sudah digunakan oleh pengguna lain");
      }
    }

    const updateData: any = {
      email,
      name: name || null,
      role: role as any,
    };

    // Only update password if provided
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
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
        <h1 className="text-2xl font-bold text-slate-900">Edit Pengguna</h1>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui informasi pengguna
        </p>
      </div>

      <form
        action={updateUser}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user.name || ""}
            placeholder="Masukkan nama lengkap"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            defaultValue={user.email}
            placeholder="nama@example.com"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password Baru
          </label>
          <input
            type="password"
            name="password"
            placeholder="Kosongkan jika tidak ingin mengubah password"
            minLength={6}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Kosongkan jika tidak ingin mengubah password
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Role / Peran <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            required
            defaultValue={user.role}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ADMIN">Administrator - Akses penuh ke sistem</option>
            <option value="TEACHER">Guru - Dapat mengelola konten</option>
            <option value="STUDENT">Siswa - Akses terbatas</option>
            <option value="ALUMNI">Alumni - Akses terbatas</option>
          </select>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Simpan Perubahan
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

      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="text-sm text-slate-600 space-y-1">
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Terdaftar:</strong>{" "}
            {new Date(user.createdAt).toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Terakhir Diupdate:</strong>{" "}
            {new Date(user.updatedAt).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}
