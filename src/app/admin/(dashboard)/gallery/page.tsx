import Link from "next/link";
import { Wrench } from "lucide-react";

export default function AdminGalleryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <Wrench size={48} className="text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Galeri Foto</h1>
      <p className="text-slate-500 max-w-md">Fitur ini sedang dalam pengembangan. Segera hadir untuk manajemen foto dan video sekolah.</p>
      
      <Link href="/admin" className="mt-6 text-blue-600 hover:underline">Kembali ke Dashboard</Link>
    </div>
  );
}
