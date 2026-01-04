"use client";

import { Trash } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button 
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
          startTransition(async () => {
             const result = await onDelete(id);
             if (!result.success) {
                alert("Gagal menghapus: " + result.error);
             } else {
                router.refresh();
             }
          });
        }
      }}
    >
      <Trash size={18} />
    </button>
  );
}
