import { SCHOOL_INFO } from "@/lib/constants";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Globe,
  Phone,
  User,
  LogIn,
} from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  schoolInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    socialMedia?: Array<{ platform: string; url: string }>;
    // Legacy support
    socials: {
      facebook: string;
      instagram: string;
      youtube: string;
      tiktok: string;
    };
  };
}

const SocialIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes("facebook")) return <Facebook size={14} />;
  if (p.includes("instagram")) return <Instagram size={14} />;
  if (p.includes("youtube")) return <Youtube size={14} />;
  if (p.includes("twitter") || p.includes("x.com"))
    return <Twitter size={14} />;
  if (p.includes("linkedin")) return <Linkedin size={14} />;
  if (p.includes("github")) return <Github size={14} />;
  if (p.includes("tiktok"))
    return <span className="font-bold text-[10px]">TT</span>; // Lucide might not have TikTok
  return <Globe size={14} />;
};

export function TopBar({ schoolInfo }: TopBarProps) {
  // Use new socialMedia array, fallback to legacy if empty (though service handles migration)
  const socials =
    schoolInfo.socialMedia && schoolInfo.socialMedia.length > 0
      ? schoolInfo.socialMedia
      : [];

  return (
    <div className="bg-slate-900 text-slate-300 py-2 text-sm hidden md:block">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Left: Contact & Socials */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone size={14} />
            <span>{schoolInfo.phone}</span>
          </div>
          <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
            {socials.map((social, idx) => (
              <Link
                key={idx}
                href={social.url}
                target="_blank"
                className="hover:text-blue-500 transition-colors"
                title={social.platform}
              >
                <SocialIcon platform={social.platform} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Login & Language */}
        <div className="flex items-center gap-4">
          <div className="group relative">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <User size={14} />
              <span>Login Area</span>
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link
                href="/login/student"
                className="block px-4 py-2 hover:bg-slate-100 flex items-center gap-2"
              >
                <LogIn size={14} /> Login Siswa
              </Link>
              <Link
                href="/login/teacher"
                className="block px-4 py-2 hover:bg-slate-100 flex items-center gap-2"
              >
                <User size={14} /> Login Guru
              </Link>
              <Link
                href="/login/alumni"
                className="block px-4 py-2 hover:bg-slate-100 flex items-center gap-2"
              >
                <User size={14} /> Login Alumni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
