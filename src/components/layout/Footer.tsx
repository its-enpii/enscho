import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
} from "lucide-react";

interface FooterProps {
  schoolInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    footerDescription?: string | null;
    openingHours?: string | null;
    logoUrl?: string | null;
    logoIconUrl?: string | null;
    socials?: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
      tiktok?: string;
    };
    socialMedia?: any[];
  };
  majors: { name: string; slug: string }[];
}

export function Footer({ schoolInfo, majors }: FooterProps) {
  // Helper to get social link
  const getSocialLink = (platform: string) => {
    if (schoolInfo.socialMedia && schoolInfo.socialMedia.length > 0) {
      const found = schoolInfo.socialMedia.find(
        (s: any) => s.platform.toLowerCase() === platform.toLowerCase()
      );
      return found ? found.url : "";
    }
    // Fallback to legacy
    return (
      schoolInfo.socials?.[platform as keyof typeof schoolInfo.socials] || ""
    );
  };

  const facebookUrl = getSocialLink("facebook");
  const instagramUrl = getSocialLink("instagram");
  const youtubeUrl = getSocialLink("youtube");
  const tiktokUrl = getSocialLink("tiktok");

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            {schoolInfo.logoUrl ? (
              <div className="mb-4">
                <img
                  src={schoolInfo.logoUrl}
                  alt={`${schoolInfo.name} Logo`}
                  className="h-12 w-auto"
                />
              </div>
            ) : (
              <h3 className="text-white text-lg font-bold mb-4">
                {schoolInfo.name}
              </h3>
            )}
            <p className="mb-6 leading-relaxed text-slate-400">
              {schoolInfo.footerDescription ||
                "Mewujudkan generasi unggul yang siap kerja, cerdas, dan berkarakter melalui pendidikan vokasi berkualitas."}
            </p>
            <div className="flex items-start gap-3 text-slate-400 mb-6">
              <MapPin size={18} className="mt-1 shrink-0 text-blue-500" />
              <span>{schoolInfo.address}</span>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Facebook size={16} />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <Instagram size={16} />
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Youtube size={16} />
                </a>
              )}
              {/* TikTok (using Link/Twitter icon as placeholder if Lucide doesn't have TikTok yet or custom svg) - defaulting to generic link if needed, but usually Twitter/X is close enough for demo */}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Tautan Pintas</h3>
            <ul className="space-y-2">
              {[
                { label: "Info PPDB", href: "/ppdb" },
                { label: "Profil Sekolah", href: "/profil" },
                { label: "Lowongan Kerja", href: "/hubin/loker" },
                { label: "Berita Terbaru", href: "/berita" },
                { label: "Kontak Kami", href: "/kontak" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-blue-400 transition-colors block py-1 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Jurusan (Dynamic) */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              Kompetensi Keahlian
            </h3>
            <ul className="space-y-2">
              {majors.length > 0 ? (
                majors.map((major) => (
                  <li key={major.slug}>
                    <Link
                      href={`/jurusan/${major.slug}`}
                      className="hover:text-blue-400 transition-colors block py-1 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                      {major.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">
                  Belum ada data jurusan.
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Hubungi Kami</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-500">
                  <Phone size={16} />
                </div>
                <span>{schoolInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-500">
                  <Mail size={16} />
                </div>
                <span>{schoolInfo.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 mt-1 shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">
                    Jam Operasional:
                  </p>
                  {schoolInfo.openingHours ? (
                    schoolInfo.openingHours.split("\n").map((line, i) => (
                      <p key={i} className="text-xs text-slate-400">
                        {line}
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="text-xs text-slate-400">
                        Senin - Jumat: 07:00 - 16:00
                      </p>
                      <p className="text-xs text-slate-400">
                        Sabtu: 07:00 - 12:00
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {schoolInfo.name}. All rights
            reserved.
          </p>
          <p className="text-xs">Developed by Enpii Studio</p>
        </div>
      </div>
    </footer>
  );
}
