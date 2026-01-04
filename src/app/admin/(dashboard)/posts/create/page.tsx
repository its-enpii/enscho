import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Editor from "@/components/ui/Editor";
import { saveFile } from "@/lib/upload";
import ImageUpload from "@/components/ui/ImageUpload";

export default function CreatePostForm() {
  async function createPost(formData: FormData) {
    "use server";
    
    const imageFile = formData.get("image") as File;
    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, "posts");
    }

    await prisma.post.create({
      data: {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        category: formData.get("category") as string,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        published: formData.get("published") === "on",
        imageUrl,
      }
    });

    redirect("/admin/posts");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/posts" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tulis Berita Baru</h1>

      <form action={createPost} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Berita</label>
              <input name="title" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Judul artikel..." />
           </div>
           
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL</label>
              <input name="slug" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="judul-artikel" />
           </div>

           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select name="category" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                 <option value="news">Berita</option>
                 <option value="article">Artikel</option>
                 <option value="agenda">Agenda</option>
                 <option value="loker">Info Loker</option>
              </select>
           </div>
        </div>

        <div>
           <ImageUpload name="image" label="Gambar Utama" />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Ringkasan (Excerpt)</label>
           <textarea name="excerpt" required rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ringkasan singkat untuk ditampilkan di kartu..."></textarea>
        </div>

        <div>
           <Editor name="content" label="Konten Lengkap" disableMedia={true} />
        </div>

        <div className="flex items-center gap-2">
           <input type="checkbox" name="published" id="published" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
           <label htmlFor="published" className="text-sm font-medium text-slate-700">Publikasikan sekarang?</label>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
             Simpan Berita
           </button>
        </div>
      </form>
    </div>
  );
}
