"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Bell,
  User as UserIcon,
  ChevronRight,
  Search,
  Globe,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Role } from "@prisma/client";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string | null;
    email: string;
    role: Role;
  };
  schoolName: string;
}

export function DashboardShell({
  children,
  user,
  schoolName,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900">
                  {schoolName}
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {user.role} PORTAL
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Search (Hidden on Mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari fitur atau data..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-xl text-sm transition-all"
              />
            </div>
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
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group">
              <Bell
                size={20}
                className="text-slate-600 group-hover:text-blue-600"
              />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-100 ml-2">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {user.name || "User"}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                  {user.role}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <UserIcon size={20} />
              </div>
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
      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
