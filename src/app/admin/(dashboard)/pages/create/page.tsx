import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Editor from "@/components/ui/Editor";

export default function CreatePageForm() {
  async function createPage(formData: FormData) {
    "use server";
    
    await prisma.page.create({
      data: {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        content: formData.get("content") as string,
      }
    });

    redirect("/admin/pages");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/pages" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tambah Halaman Baru</h1>

      <form action={createPage} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Halaman</label>
              <input name="title" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Sejarah Sekolah" />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL</label>
              <input name="slug" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: sejarah" />
           </div>
        </div>

        <div>
           <Editor name="content" label="Konten Lengkap" />
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
             Simpan Halaman
           </button>
        </div>
      </form>
    </div>
  );
}
