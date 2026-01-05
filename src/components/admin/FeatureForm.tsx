"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Award, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";

// Server action imports would be passed or imported, but for simplicity we'll pass the submit handler or fetch
import {
  createFeature,
  updateFeature,
} from "@/app/admin/(dashboard)/features/actions";

const schema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  icon: z.string().min(1, "Icon wajib diisi"),
  color: z.string().min(1, "Warna wajib diisi"),
  order: z.coerce.number().int().default(0),
});

type FeatureFormValues = z.infer<typeof schema>;

interface FeatureFormProps {
  initialData?: any;
}

export function FeatureForm({ initialData }: FeatureFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: "",
      description: "",
      icon: "Award",
      color: "blue",
      order: 0,
    },
  });

  const onSubmit = async (data: FeatureFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (initialData) {
        await updateFeature(initialData.id, data);
      } else {
        await createFeature(data);
      }
      router.push("/admin/features");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = [
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "green", label: "Green" },
    { value: "red", label: "Red" },
    { value: "amber", label: "Amber" },
    { value: "cyan", label: "Cyan" },
    { value: "indigo", label: "Indigo" },
    { value: "pink", label: "Pink" },
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("title")}
            className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            placeholder="Contoh: Kurikulum Merdeka"
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Urutan
          </label>
          <input
            type="number"
            {...form.register("order")}
            className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          />
          <p className="text-xs text-slate-500">
            Urutan tampilan (kecil ke besar)
          </p>
        </div>

        <div className="col-span-full space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            {...form.register("description")}
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            placeholder="Jelaskan keunggulan ini..."
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Icon (Lucide React) <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              {...form.register("icon")}
              className="flex-1 px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              placeholder="Contoh: Award, Book, Users"
            />
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors font-medium border border-slate-200"
            >
              Cari Icon
            </a>
          </div>

          {/* Icon Preview */}
          {(() => {
            const iconName = form.watch("icon");
            // @ts-ignore
            const IconPreview = Icons[iconName];
            return IconPreview ? (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <IconPreview size={20} className="text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Icon ditemukan: {iconName}
                </span>
              </div>
            ) : (
              iconName && (
                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-sm text-red-600 font-medium">
                    Icon tidak valid: {iconName}
                  </span>
                </div>
              )
            );
          })()}
          {form.formState.errors.icon && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.icon.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Warna Tema <span className="text-red-500">*</span>
          </label>
          <select
            {...form.register("color")}
            className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          >
            {colors.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          Simpan
        </button>
      </div>
    </form>
  );
}
