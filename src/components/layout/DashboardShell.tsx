"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
  Menu,
  X,
  Bell,
  User as UserIcon,
  ChevronRight,
  Search,
  Globe,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { AdminFooter } from "@/components/layout/AdminFooter";
import { Role } from "@prisma/client";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string | null;
    email: string;
    role: Role;
    image?: string | null;
  };
  schoolName: string;
  logoUrl?: string | null;
  recentPosts?: Array<{
    id: string;
    title: string;
    category: string;
    createdAt: Date;
    slug: string;
  }>;
}

export function DashboardShell({
  children,
  user,
  schoolName,
  logoUrl,
  recentPosts = [],
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const { confirm } = useConfirm();

  const handleLogout = async () => {
    const isConfirmed = await confirm({
      title: "Konfirmasi Keluar",
      message: "Apakah Anda yakin ingin keluar dari sesi ini?",
      confirmText: "Keluar",
      cancelText: "Batal",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-30 h-16">
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link
              href={
                user.role === "ADMIN" ? "/admin" : `/${user.role.toLowerCase()}`
              }
              className="flex items-center gap-3"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={schoolName}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SE</span>
                </div>
              )}
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Globe size={16} /> Website
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group"
              >
                <Bell
                  size={20}
                  className="text-slate-600 group-hover:text-blue-600"
                />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">
                      Notifikasi Terbaru
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {recentPosts.length > 0 ? (
                      recentPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/berita/${post.slug}`}
                          className="block p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                          onClick={() => setNotificationOpen(false)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900 line-clamp-2">
                                {post.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                  {post.category.charAt(0).toUpperCase() +
                                    post.category.slice(1)}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {new Date(post.createdAt).toLocaleDateString(
                                    "id-ID",
                                    { day: "numeric", month: "short" }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        Tidak ada notifikasi baru
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 pl-2 border-l border-slate-100 ml-2 hover:bg-slate-50 rounded-lg transition-colors p-2 -m-2"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {user.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                    {user.role}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 overflow-hidden">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                  <div className="p-2">
                    <Link
                      href={
                        user.role === "ADMIN" ? "/admin/profile" : "/profile"
                      }
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Settings size={16} />
                      Pengaturan Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <DashboardSidebar
        role={user.role}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="pt-16 lg:ml-64 min-h-screen flex flex-col">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
        <AdminFooter />
      </main>
    </div>
  );
}
