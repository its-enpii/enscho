"use client";

interface Partner {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export function PartnerMarquee({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  // Duplicate for smooth infinite scroll if few items
  const displayPartners = partners.length < 5 ? [...partners, ...partners, ...partners] : partners;

  return (
    <section className="py-16 bg-white border-t border-slate-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
         <p className="text-slate-500 font-medium">Dipercaya oleh berbagai Perusahaan & Instansi terkemuka</p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
           {/* Render twice for seamless loop */}
           {[...displayPartners, ...displayPartners].map((partner, idx) => (
              <div key={`${partner.id}-${idx}`} className="w-40 h-20 flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                 {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                 ) : (
                    <span className="text-slate-400 font-bold text-lg">{partner.name}</span>
                 )}
              </div>
           ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
