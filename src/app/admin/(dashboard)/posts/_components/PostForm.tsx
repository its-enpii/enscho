"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import Editor from "@/components/ui/Editor";
import ImageUpload from "@/components/ui/ImageUpload";
import { useToast } from "@/components/ui/ToastProvider";

interface PostFormProps {
  initialData?: any;
  action: (formData: FormData) => Promise<any>;
  titleText: string;
}

export default function PostForm({
  initialData,
  action,
  titleText,
}: PostFormProps) {
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
          showSuccess("Berita berhasil disimpan");
          setTimeout(() => {
            router.push("/admin/posts");
            router.refresh();
          }, 1000);
        } else if (result?.error) {
          showError(result.error);
        }
      } catch (error) {
        showError("Gagal menyimpan berita");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/posts"
        className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">{titleText}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Judul Berita
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={initialData?.title}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Judul artikel..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug URL
            </label>
            <input
              name="slug"
              type="text"
              required
              defaultValue={initialData?.slug}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="judul-artikel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kategori
            </label>
            <select
              name="category"
              defaultValue={initialData?.category || "news"}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="news">Berita</option>
              <option value="article">Artikel</option>
              <option value="agenda">Agenda</option>
              <option value="loker">Info Loker</option>
            </select>
          </div>
        </div>

        <div>
          <ImageUpload
            name="image"
            label="Gambar Utama"
            defaultValue={initialData?.imageUrl}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ringkasan (Excerpt)
          </label>
          <textarea
            name="excerpt"
            required
            rows={3}
            defaultValue={initialData?.excerpt}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ringkasan singkat untuk ditampilkan di kartu..."
          ></textarea>
        </div>

        <div>
          <Editor
            name="content"
            label="Konten Lengkap"
            defaultValue={initialData?.content}
            disableMedia={true}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={initialData?.published}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="published"
            className="text-sm font-medium text-slate-700"
          >
            Publikasikan sekarang?
          </label>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> {isPending ? "Menyimpan..." : "Simpan Berita"}
          </button>
        </div>
      </form>
    </div>
  );
}
