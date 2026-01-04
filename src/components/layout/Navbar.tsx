"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAVIGATION_MENU, SCHOOL_INFO } from "@/lib/constants";
import clsx from "clsx";

export function Navbar({ schoolName, logoUrl, menuItems }: { schoolName: string; logoUrl?: string | null; menuItems: typeof NAVIGATION_MENU }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = menuItems || NAVIGATION_MENU;

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 w-full transition-all duration-300 border-b",
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2" : "bg-white py-4 border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {logoUrl ? (
                <img src={logoUrl} alt={schoolName} className="h-10 w-auto object-contain" />
            ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {schoolName.charAt(0)}
                </div>
            )}
            <span className={clsx("font-bold text-xl tracking-tight transition-colors", scrolled ? "text-slate-900" : "text-slate-900")}>
               {schoolName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors py-2"
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 pt-2 z-50">
                     <div className="flex flex-col py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/ppdb"
              className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Daftar PPDB
            </Link>

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-slate-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
         <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col p-4 space-y-4">
              {navigation.map((item) => (
                <div key={item.label}>
                   {item.children ? (
                     <div className="space-y-2">
                        <div className="font-medium text-slate-900">{item.label}</div>
                        <div className="pl-4 border-l-2 border-slate-100 space-y-2">
                           {item.children.map(child => (
                             <Link key={child.label} href={child.href} className="block text-sm text-slate-600" onClick={() => setIsOpen(false)}>
                               {child.label}
                             </Link>
                           ))}
                        </div>
                     </div>
                   ) : (
                     <Link href={item.href} className="block font-medium text-slate-900" onClick={() => setIsOpen(false)}>
                       {item.label}
                     </Link>
                   )}
                </div>
              ))}
               <Link href="/ppdb" className="block text-center bg-blue-600 text-white py-3 rounded-lg font-bold" onClick={() => setIsOpen(false)}>
                 Daftar Sekaran
               </Link>
            </div>
         </div>
      )}
    </header>
  );
}
