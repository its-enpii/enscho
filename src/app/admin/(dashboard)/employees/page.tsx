import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users, GraduationCap, UserCog } from "lucide-react";
import { deleteEmployee } from "./actions";
import EmployeesTable from "./_components/EmployeesTable";

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  const stats = {
    total: employees.length,
    kepsek: employees.filter((e) => e.category === "KEPSEK").length,
    guru: employees.filter((e) => e.category === "GURU").length,
    staf: employees.filter((e) => e.category === "STAF").length,
  };

  async function handleDelete(id: string) {
    "use server";
    return await deleteEmployee(id);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Data Guru & Staf
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola data pengajar dan staf kependidikan
          </p>
        </div>
        <Link
          href="/admin/employees/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} /> Tambah Data
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCog size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Kepala Sekolah
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.kepsek}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Guru</p>
              <p className="text-2xl font-bold text-slate-900">{stats.guru}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Staf</p>
              <p className="text-2xl font-bold text-slate-900">{stats.staf}</p>
            </div>
          </div>
        </div>
      </div>

      <EmployeesTable employees={employees} onDelete={handleDelete} />
    </div>
  );
}
