import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Building2, Globe } from "lucide-react";

export default async function MitraPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="bg-white min-h-screen">
       <div className="bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 py-16 text-center">
             <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Hubungan Industri</span>
             <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mt-2 mb-6">Mitra Industri</h1>
             <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                Kami bekerjasama dengan berbagai perusahaan terkemuka untuk memastikan kurikulum yang relevan, 
                tempat praktik yang berkualitas, dan penyaluran lulusan yang optimal.
             </p>
          </div>
       </div>

       <div className="container mx-auto px-4 py-16">
          {partners.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {partners.map(partner => (
                   <div key={partner.id} className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center">
                      <div className="w-full h-32 relative mb-4 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden p-4">
                         {partner.logoUrl ? (
                            <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain p-2" />
                         ) : (
                            <Building2 className="text-slate-300" size={48} />
                         )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-center mb-2 line-clamp-2">{partner.name}</h3>
                      {partner.website && (
                         <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-auto">
                            <Globe size={12} /> Website
                         </a>
                      )}
                   </div>
                ))}
             </div>
          ) : (
             <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                   <Building2 className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Belum ada data mitra</h3>
                <p className="text-slate-500 mt-2">Daftar mitra industri akan segera diperbarui.</p>
             </div>
          )}
       </div>
    </div>
  );
}
