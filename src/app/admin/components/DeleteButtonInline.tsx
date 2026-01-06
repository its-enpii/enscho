"use client";

import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { Trash2 } from "lucide-react";

interface DeleteButtonInlineProps {
  itemId: string;
  itemName: string;
  onDelete: (formData: FormData) => Promise<void>;
  className?: string;
}

export function DeleteButtonInline({
  itemId,
  itemName,
  onDelete,
  className,
}: DeleteButtonInlineProps) {
  const { confirm } = useConfirm();
  const { showSuccess, showError } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    const isConfirmed = await confirm({
      title: "Hapus Data",
      message: `Yakin ingin menghapus "${itemName}"?`,
      confirmText: "Ya, Hapus",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("id", itemId);
      await onDelete(formData);
      showSuccess("Data berhasil dihapus");
    } catch (error) {
      showError("Gagal menghapus data");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={
        className ||
        "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      }
      title="Hapus"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}
