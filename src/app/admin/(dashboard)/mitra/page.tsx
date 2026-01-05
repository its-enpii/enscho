import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { deletePartner } from "./actions";
import PartnersTable from "./_components/PartnersTable";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function handleDelete(id: string) {
    "use server";
    return await deletePartner(id);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mitra Industri</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola data mitra kerjasama industri
          </p>
        </div>
        <Link
          href="/admin/mitra/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} /> Tambah Mitra
        </Link>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Mitra</p>
              <p className="text-2xl font-bold text-slate-900">
                {partners.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PartnersTable partners={partners} onDelete={handleDelete} />
    </div>
  );
}
