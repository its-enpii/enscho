"use client";

interface Partner {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export function PartnerMarquee({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  // Duplicate content to ensure it fills screen width for seamless loop
  let displayPartners = [...partners];
  while (displayPartners.length < 15) {
    displayPartners = [...displayPartners, ...partners];
  }

  return (
    <section className="py-16 bg-white border-t border-slate-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-slate-500 font-medium">
          Dipercaya oleh berbagai Perusahaan & Instansi terkemuka
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-12 items-center pr-12 shrink-0">
          {displayPartners.map((partner, idx) => (
            <div
              key={`p1-${partner.id}-${idx}`}
              className="w-40 h-20 flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-slate-400 font-bold text-lg">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          className="flex animate-marquee whitespace-nowrap gap-12 items-center pr-12 shrink-0"
          aria-hidden="true"
        >
          {displayPartners.map((partner, idx) => (
            <div
              key={`p2-${partner.id}-${idx}`}
              className="w-40 h-20 flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-slate-400 font-bold text-lg">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
