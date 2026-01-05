import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText, Download, Trash2 } from "lucide-react";
import { DeleteButton } from "@/app/admin/components/DeleteButton";
import { deleteDocument } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dokumen Unduhan</h1>
        <Link
          href="/admin/documents/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Upload Dokumen
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-900">
                Judul Dokumen
              </th>
              <th className="px-6 py-4 font-semibold text-slate-900">
                Kategori
              </th>
              <th className="px-6 py-4 font-semibold text-slate-900">Ukuran</th>
              <th className="px-6 py-4 font-semibold text-slate-900 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  Belum ada dokumen.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    {doc.title}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{doc.size}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Download / View"
                      >
                        <Download size={18} />
                      </a>
                      <DeleteButton id={doc.id} onDelete={deleteDocument} />
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
