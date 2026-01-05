"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

interface LogoutButtonProps {
  variant?: "admin" | "portal";
  className?: string;
}

export function LogoutButton({
  variant = "admin",
  className,
}: LogoutButtonProps) {
  const handleLogout = async (formData: FormData) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin keluar dari sistem?"
    );
    if (confirmed) {
      await logout();
    }
  };

  if (variant === "portal") {
    return (
      <form action={handleLogout}>
        <button
          className={
            className ||
            "p-2 text-slate-400 hover:text-red-600 transition-colors"
          }
          title="Keluar"
        >
          <LogOut size={20} />
        </button>
      </form>
    );
  }

  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className={
          className ||
          "flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
        }
      >
        <LogOut size={20} />
        <span className="text-sm font-medium">Keluar</span>
      </button>
    </form>
  );
}
