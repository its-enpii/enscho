import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { DeleteButton } from "@/app/admin/components/DeleteButton";
import { deleteEmployee } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: [
        { category: 'asc' },
        { order: 'asc' }
    ]
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Users className="text-blue-600" /> Data Guru & Staf
           </h1>
           <p className="text-slate-500 text-sm mt-1">Kelola data pengajar dan staf kependidikan.</p>
        </div>
        <Link 
          href="/admin/employees/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Data
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-900 w-16">No</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Nama Lengkap</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Kategori</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Jabatan</th>
              <th className="px-6 py-4 font-semibold text-slate-900 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                   <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                   <p>Belum ada data guru atau staf.</p>
                </td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-400">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {emp.imageUrl ? (
                           <img src={emp.imageUrl} alt={emp.name} className="w-full h-full object-cover" />
                        ) : (
                           <Users className="w-full h-full p-2 text-slate-400" />
                        )}
                     </div>
                     {emp.name}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                        emp.category === 'KEPSEK' ? 'bg-purple-100 text-purple-700' :
                        emp.category === 'GURU' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                     }`}>
                        {emp.category}
                     </span>
                  </td>
                  <td className="px-6 py-4">{emp.position || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link 
                         href={`/admin/employees/${emp.id}/edit`}
                         className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                       >
                          <Pencil size={18} />
                       </Link>
                       <DeleteButton id={emp.id} onDelete={deleteEmployee} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
