"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useConfirm } from "@/components/ui/ConfirmDialog";

interface LogoutButtonProps {
  variant?: "admin" | "portal";
  className?: string;
}

export function LogoutButton({
  variant = "admin",
  className,
}: LogoutButtonProps) {
  const { confirm } = useConfirm();

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Konfirmasi Keluar",
      message: "Apakah Anda yakin ingin keluar dari sesi ini?",
      confirmText: "Keluar",
      cancelText: "Batal",
      variant: "danger",
    });

    if (confirmed) {
      await logout();
    }
  };

  if (variant === "portal") {
    return (
      <button
        onClick={handleLogout}
        className={
          className || "p-2 text-slate-400 hover:text-red-600 transition-colors"
        }
        title="Keluar"
      >
        <LogOut size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      type="button"
      className={
        className ||
        "flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
      }
    >
      <LogOut size={20} />
      <span className="text-sm font-medium">Keluar</span>
    </button>
  );
}
