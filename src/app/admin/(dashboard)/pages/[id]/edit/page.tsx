import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Editor from "@/components/ui/Editor";

export default async function EditPageForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const page = await prisma.page.findUnique({
    where: { id }
  });

  if (!page) {
    notFound();
  }

  async function updatePage(formData: FormData) {
    "use server";
    
    await prisma.page.update({
      where: { id },
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
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Halaman</h1>

      <form action={updatePage} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Halaman</label>
              <input 
                name="title" 
                type="text" 
                required 
                defaultValue={page.title}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL</label>
              <input 
                name="slug" 
                type="text" 
                required 
                defaultValue={page.slug}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
           </div>
        </div>

        <div>
           <Editor name="content" label="Konten Lengkap" defaultValue={page.content} />
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
             Simpan Perubahan
           </button>
        </div>
      </form>
    </div>
  );
}
