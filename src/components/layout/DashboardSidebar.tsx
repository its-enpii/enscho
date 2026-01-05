"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Image as ImageIcon,
  Users,
  LogOut,
  Building2,
  GraduationCap,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Role } from "@prisma/client";

interface MenuItem {
  label: string;
  href?: string;
  icon: any;
  children?: { label: string; href: string }[];
  roles?: Role[]; // If not specified, accessible by ADMIN
}

const allMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/portal", // Will be prefixed by role/admin
    icon: LayoutDashboard,
    roles: ["ADMIN", "TEACHER", "STUDENT", "ALUMNI"],
  },
  {
    label: "PPDB",
    href: "/admin/ppdb",
    icon: ClipboardList,
    roles: ["ADMIN"],
  },
  {
    label: "Konten Website",
    icon: FileText,
    roles: ["ADMIN", "TEACHER", "ALUMNI"],
    children: [
      { label: "Hero Carousel", href: "/admin/hero" },
      { label: "Halaman Statis", href: "/admin/pages" },
      { label: "Keunggulan Sekolah", href: "/admin/features" },
      { label: "Berita & Artikel", href: "/admin/posts" },
      { label: "Galeri Foto", href: "/admin/gallery" },
      { label: "Dokumen", href: "/admin/documents" },
    ],
  },
  {
    label: "Galeri Foto",
    href: "/portal/gallery",
    icon: ImageIcon,
    roles: ["STUDENT"],
  },
  {
    label: "Akademik",
    icon: GraduationCap,
    roles: ["ADMIN", "TEACHER"],
    children: [
      { label: "Kompetensi Keahlian", href: "/admin/jurusan" },
      { label: "Akademik", href: "/admin/akademik" },
    ],
  },
  {
    label: "SDM",
    icon: Users,
    roles: ["ADMIN"],
    children: [
      { label: "Guru & Staf", href: "/admin/employees" },
      { label: "Pengguna Sistem", href: "/admin/users" },
    ],
  },
  {
    label: "Kemitraan",
    icon: Building2,
    roles: ["ADMIN"],
    children: [{ label: "Mitra Industri", href: "/admin/mitra" }],
  },
  {
    label: "Pengaturan",
    href: "/admin/config",
    icon: Settings,
    roles: ["ADMIN"],
  },
];

interface DashboardSidebarProps {
  role: Role;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardSidebar({
  role,
  sidebarOpen,
  setSidebarOpen,
}: DashboardSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // Filter menu based on role
  const filteredMenu = allMenuItems
    .filter((item) => {
      if (role === "ADMIN") return true;
      if (!item.roles) return false;
      return item.roles.includes(role);
    })
    .map((item) => {
      // Re-map children based on role if needed
      if (item.children && role !== "ADMIN") {
        let allowedChildren = item.children;
        if (role === "TEACHER") {
          allowedChildren = item.children.filter((c) =>
            [
              "Kompetensi Keahlian",
              "Berita & Artikel",
              "Halaman Statis",
            ].includes(c.label)
          );
        } else if (role === "ALUMNI") {
          allowedChildren = item.children.filter((c) =>
            ["Berita & Artikel", "Halaman Statis"].includes(c.label)
          );
        }
        return {
          ...item,
          children: allowedChildren.length > 0 ? allowedChildren : undefined,
        };
      }

      // Adjust href for dashboard
      if (item.label === "Dashboard") {
        const dashPath =
          role === "ADMIN"
            ? "/admin"
            : role === "TEACHER"
            ? "/guru"
            : role === "STUDENT"
            ? "/siswa"
            : "/alumni";
        return { ...item, href: dashPath };
      }

      // If Student - Galeri Foto adjustments
      if (item.label === "Galeri Foto" && role === "STUDENT") {
        return { ...item, href: "/siswa/gallery" };
      }

      return item;
    })
    .filter((item) => {
      // Final filter for items that might have lost all children
      if (item.children === undefined && !item.href) return false;
      return true;
    });

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 transition-transform duration-300 z-20 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => (
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

        <LogoutButton variant="admin" />
      </div>
    </aside>
  );
}
