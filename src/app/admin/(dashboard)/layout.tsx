"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Settings,
  Image as ImageIcon,
  Users,
  LogOut,
  Building2,
  GraduationCap,
  ClipboardList,
  Award,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  User,
  Download,
  Newspaper,
} from "lucide-react";

interface MenuItem {
  label: string;
  href?: string;
  icon: any;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "PPDB",
    href: "/admin/ppdb",
    icon: ClipboardList,
  },
  {
    label: "Konten Website",
    icon: FileText,
    children: [
      { label: "Halaman Statis", href: "/admin/pages" },
      { label: "Keunggulan Sekolah", href: "/admin/features" },
      { label: "Berita & Artikel", href: "/admin/posts" },
      { label: "Galeri Foto", href: "/admin/gallery" },
      { label: "Dokumen", href: "/admin/documents" },
    ],
  },
  {
    label: "Akademik",
    icon: GraduationCap,
    children: [
      { label: "Kompetensi Keahlian", href: "/admin/jurusan" },
      { label: "Akademik", href: "/admin/akademik" },
    ],
  },
  {
    label: "SDM",
    icon: Users,
    children: [
      { label: "Guru & Staf", href: "/admin/employees" },
      { label: "Pengguna Sistem", href: "/admin/users" },
    ],
  },
  {
    label: "Kemitraan",
    icon: Building2,
    children: [{ label: "Mitra Industri", href: "/admin/mitra" }],
  },
  {
    label: "Pengaturan",
    href: "/admin/config",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-30 h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900">SMK Enscho</h1>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Center: Search (optional) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Lihat Website
            </Link>
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User size={16} className="text-slate-600" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 transition-transform duration-300 z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={20}
                          className="text-slate-500 group-hover:text-blue-600"
                        />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                          {item.label}
                        </span>
                      </div>
                      {expandedMenus.includes(item.label) ? (
                        <ChevronDown size={16} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-400" />
                      )}
                    </button>
                    {expandedMenus.includes(item.label) && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                              pathname === child.href
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={
                        pathname === item.href
                          ? "text-blue-600"
                          : "text-slate-500"
                      }
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200">
            <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors">
              <LogOut size={20} />
              <span className="text-sm font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
