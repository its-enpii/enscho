import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { saveFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export default function CreatePartnerForm() {
  async function createPartner(formData: FormData) {
    "use server";
    
    const imageFile = formData.get("image") as File;
    let logoUrl = "";

    if (imageFile && imageFile.size > 0) {
      logoUrl = await saveFile(imageFile, "partners");
    }

    await prisma.partner.create({
      data: {
        name: formData.get("name") as string,
        website: formData.get("website") as string,
        logoUrl,
      }
    });

    revalidatePath("/admin/mitra");
    revalidatePath("/hubin/mitra");
    redirect("/admin/mitra");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/mitra" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tambah Mitra Industri</h1>

      <form action={createPartner} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
           <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="PT. Example Indonesia" />
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Website (Opsional)</label>
           <input name="website" type="url" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://example.com" />
        </div>

        <div>
           <ImageUpload name="image" label="Logo Perusahaan" />
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
             Simpan Mitra
           </button>
        </div>
      </form>
    </div>
  );
}
