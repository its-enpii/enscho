import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { createDocument } from "../actions";

export default function UploadDocumentPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/documents" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Upload Dokumen Baru</h1>

      <form action={createDocument} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Judul Dokumen</label>
           <input name="title" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Kalender Akademik 2024" />
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
           <select name="category" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="akademik">Akademik</option>
              <option value="formulir">Formulir</option>
              <option value="lainnya">Lainnya</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">File Dokumen (PDF, DOCX, IMG)</label>
           <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer relative">
              <input name="file" type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center pointer-events-none">
                 <UploadCloud className="text-blue-500 mb-2" size={32} />
                 <span className="text-sm font-medium text-slate-700">Klik atau drag file ke sini</span>
                 <span className="text-xs text-slate-500 mt-1">Maksimal 10MB</span>
              </div>
           </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
             Upload
           </button>
        </div>
      </form>
    </div>
  );
}
