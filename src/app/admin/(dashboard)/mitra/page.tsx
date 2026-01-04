import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Building2, Pencil } from "lucide-react";
import Image from "next/image";
import { DeleteButton } from "@/app/admin/components/DeleteButton";
import { deletePartner } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mitra Industri</h1>
        <Link 
          href="/admin/mitra/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Mitra
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-900">Logo</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Nama Perusahaan</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Website</th>
              <th className="px-6 py-4 font-semibold text-slate-900 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {partners.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                   Belum ada data mitra industri.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                     <div className="w-16 h-12 relative bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                       {partner.logoUrl ? (
                         <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain p-1" />
                       ) : (
                         <Building2 className="text-slate-300" size={24} />
                       )}
                     </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{partner.name}</td>
                  <td className="px-6 py-4 text-blue-600">
                    {partner.website ? (
                      <a href={partner.website} target="_blank" rel="noreferrer" className="hover:underline">
                        {partner.website}
                      </a>
                    ) : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link href={`/admin/mitra/${partner.id}/edit`} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                          <Pencil size={18} />
                       </Link>
                       <DeleteButton id={partner.id} onDelete={deletePartner} />
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
