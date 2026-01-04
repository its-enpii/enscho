import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { saveFile } from "@/lib/upload";
import Editor from "@/components/ui/Editor";
import ImageUpload from "@/components/ui/ImageUpload";

export default function CreateMajorPage() {
  async function createMajor(formData: FormData) {
    "use server";
    // Handle form submission
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;
    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, "jurusan");
    }

    const content = formData.get("content") as string;
    const careerProspects = formData.get("careerProspects") as string;
    const competencies = formData.get("competencies") as string;

    await prisma.major.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        content,
        careerProspects,
        competencies
      } as any
    });
    
    // Revalidate global layout to update navigation menu and homepage
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");

    redirect("/admin/jurusan");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/jurusan" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tambah Jurusan Baru</h1>

      <form action={createMajor} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Jurusan</label>
              <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Teknik Kendaraan Ringan" />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL</label>
              <input name="slug" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: tkr" />
              <p className="text-xs text-slate-500 mt-1">Digunakan untuk alamat website: /jurusan/slug</p>
           </div>
        </div>

        <div>
           <ImageUpload name="image" label="Gambar Header (Opsional)" />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
           <textarea name="description" required rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Penjelasan singkat jurusan..."></textarea>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Materi Produktif / Kompetensi Unggulan</label>
           <textarea name="competencies" rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan daftar kompetensi (pisahkan dengan baris baru/enter)&#10;Contoh:&#10;Instalasi Jaringan&#10;Administrasi Server&#10;Keamanan Jaringan"></textarea>
           <p className="text-xs text-slate-500 mt-1">Satu kompetensi per baris.</p>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Prospek Karir</label>
           <textarea name="careerProspects" rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan daftar pekerjaan (pisahkan dengan baris baru/enter)&#10;Contoh:&#10;Network Engineer&#10;IT Support&#10;System Administrator"></textarea>
           <p className="text-xs text-slate-500 mt-1">Satu profesi per baris.</p>
        </div>

        <div>
           <Editor name="content" label="Konten Lengkap (Tentang Jurusan)" disableMedia={true} />
           <p className="text-xs text-slate-500 mt-1">Anda bisa menggunakan format text (Bold, Italic, List, dll).</p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
             Simpan Jurusan
           </button>
        </div>
      </form>
    </div>
  );
}
