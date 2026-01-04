"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EmployeeFormProps {
  initialData?: any;
  action: (formData: FormData) => Promise<any>;
}

export default function EmployeeForm({ initialData, action }: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        alert(result.error);
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
       };
       reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/employees" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Kembali ke Data Pegawai
      </Link>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap & Gelar</label>
            <input 
              name="name" 
              defaultValue={initialData?.name} 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: Drs. H. Budi Santoso, M.Pd"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                <select 
                  name="category" 
                  defaultValue={initialData?.category || "GURU"}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                   <option value="KEPSEK">Kepala Sekolah</option>
                   <option value="GURU">Guru / Pengajar</option>
                   <option value="STAF">Staf / Tata Usaha</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Urutan Tampil</label>
                 <input 
                  name="order" 
                  type="number"
                  defaultValue={initialData?.order || 0} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">Semakin kecil angka, semakin di depan.</p>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Jabatan / Mata Pelajaran</label>
            <input 
              name="position" 
              defaultValue={initialData?.position} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: Guru Matematika / Kepala Tata Usaha"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Foto Profil</label>
             <div className="flex gap-4 items-start">
               <div className="flex-1">
                  <input 
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={handleImageChange}
                  />
                  <input type="hidden" name="imageUrl" value={initialData?.imageUrl || ""} />
                  <p className="text-xs text-slate-500 mt-1">Upload foto (jpg, png, webp). Max 2MB.</p>
               </div>
               
               <div className="w-24 h-24 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Upload className="text-slate-300 w-10 h-10" />
                  )}
               </div>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> {isPending ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
