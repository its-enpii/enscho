"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { useToast } from "@/components/ui/ToastProvider";

interface PartnerFormProps {
  initialData?: any;
  action: (formData: FormData) => Promise<any>;
  titleText: string;
}

export default function PartnerForm({
  initialData,
  action,
  titleText,
}: PartnerFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result?.success) {
          showSuccess("Mitra berhasil disimpan");
          setTimeout(() => {
            router.push("/admin/mitra");
            router.refresh();
          }, 1000);
        } else if (result?.error) {
          showError(result.error);
        }
      } catch (error) {
        showError("Gagal menyimpan mitra");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin/mitra"
        className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">{titleText}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nama Perusahaan
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={initialData?.name}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="PT. Example Indonesia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Website (Opsional)
          </label>
          <input
            name="website"
            type="url"
            defaultValue={initialData?.website || ""}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <ImageUpload
            name="image"
            label="Logo Perusahaan"
            defaultValue={initialData?.logoUrl}
          />
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> {isPending ? "Menyimpan..." : "Simpan Mitra"}
          </button>
        </div>
      </form>
    </div>
  );
}
