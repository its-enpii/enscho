import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Plus, Shield, User as UserIcon } from "lucide-react";
import Link from "next/link";
import UserTable from "./_components/UserTable";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  async function deleteUser(id: string) {
    "use server";
    try {
      await prisma.user.delete({ where: { id } });
      revalidatePath("/admin/users");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Gagal menghapus pengguna" };
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola akun pengguna sistem (Admin, Guru, Siswa, Alumni)
          </p>
        </div>
        <Link
          href="/admin/users/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} /> Tambah Pengguna
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Admin</p>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((u) => u.role === "ADMIN").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Guru</p>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((u) => u.role === "TEACHER").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Siswa</p>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((u) => u.role === "STUDENT").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Alumni</p>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((u) => u.role === "ALUMNI").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Table with Search, Filter, Pagination */}
      <UserTable users={users} onDelete={deleteUser} />
    </div>
  );
}
