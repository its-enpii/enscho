import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { saveFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const partner = await prisma.partner.findUnique({
    where: { id }
  });

  if (!partner) {
    notFound();
  }

  async function updatePartner(formData: FormData) {
    "use server";
    
    // Handle Image Upload
    const imageFile = formData.get("image") as File;
    
    // Get current partner to preserve logo
    const currentPartner = await prisma.partner.findUnique({ where: { id } });
    if (!currentPartner) throw new Error("Partner not found");
    
    let logoUrl = currentPartner.logoUrl;

    if (imageFile && imageFile.size > 0) {
      logoUrl = await saveFile(imageFile, "partners");
    }

    await prisma.partner.update({
      where: { id },
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
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Mitra Industri</h1>

      <form action={updatePartner} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
           <input name="name" type="text" required defaultValue={partner.name} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Website (Opsional)</label>
           <input name="website" type="url" defaultValue={partner.website || ""} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
        </div>

        <div>
           <ImageUpload name="image" label="Logo Perusahaan" defaultValue={partner.logoUrl || ""} />
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
