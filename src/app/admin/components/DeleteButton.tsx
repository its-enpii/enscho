"use client";

import { Trash } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { confirm } = useConfirm();
  const { showSuccess, showError } = useToast();

  return (
    <button
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      disabled={isPending}
      onClick={async (e) => {
        e.preventDefault();
        const isConfirmed = await confirm({
          title: "Hapus Data",
          message: "Apakah Anda yakin ingin menghapus data ini?",
          confirmText: "Ya, Hapus",
          variant: "danger",
        });

        if (isConfirmed) {
          startTransition(async () => {
            const result = await onDelete(id);
            if (!result.success) {
              showError(result.error || "Gagal menghapus data");
            } else {
              showSuccess("Data berhasil dihapus");
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
