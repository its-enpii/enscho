"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@/components/ui/Editor";
import { useToast } from "@/components/ui/ToastProvider";

interface AkademikFormProps {
  page: {
    content: string;
  } | null;
}

export default function AkademikForm({ page }: AkademikFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/admin/akademik", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan konten");
      }

      showSuccess("Konten berhasil disimpan!");
      router.refresh();
    } catch (error) {
      showError("Gagal menyimpan konten. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"
    >
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Program Unggulan
      </h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Konten
        </label>
        <div className="prose-editor">
          <Editor name="content" defaultValue={page?.content || ""} />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Konten ini muncul di bagian bawah halaman akademik.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Konten"}
        </button>
      </div>
    </form>
  );
}
