import { prisma } from "@/lib/prisma";
import Editor from "@/components/ui/Editor";
import { updatePageContent } from "../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function EditSubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const page = await prisma.page.findUnique({
    where: { slug }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/akademik" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Kembali ke Pengaturan Akademik
      </Link>

      <div className="flex justify-between items-center mb-8">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Halaman: {slug}</h1>
            <p className="text-slate-500 text-sm">Sesuaikan konten untuk halaman sub-menu ini.</p>
         </div>
      </div>

      <form action={updatePageContent} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
         <input type="hidden" name="slug" value={slug} />
         
         <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Judul Halaman</label>
            <input 
              name="title" 
              defaultValue={page?.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
         </div>

         <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Konten Halaman</label>
            <div className="prose-editor">
               <Editor name="content" defaultValue={page?.content || ""} />
            </div>
         </div>

         <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2">
               <Save size={18} /> Simpan Halaman
            </button>
         </div>
      </form>
    </div>
  );
}
