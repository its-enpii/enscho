"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import Editor from "@/components/ui/Editor";
import ImageUpload from "@/components/ui/ImageUpload";

interface MajorFormProps {
  initialData?: any;
  action: (formData: FormData) => Promise<any>;
  titleText: string;
}

export default function MajorForm({
  initialData,
  action,
  titleText,
}: MajorFormProps) {
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
          showSuccess("Jurusan berhasil disimpan");
          setTimeout(() => {
            router.push("/admin/jurusan");
            router.refresh();
          }, 1000);
        } else if (result?.error) {
          showError(result.error);
        }
      } catch (error) {
        showError("Gagal menyimpan jurusan");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/jurusan"
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Jurusan
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={initialData?.name}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: Teknik Kendaraan Ringan"
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
              placeholder="Contoh: tkr"
            />
            <p className="text-xs text-slate-500 mt-1">
              Digunakan untuk alamat website: /jurusan/slug
            </p>
          </div>
        </div>

        <div>
          <ImageUpload
            name="image"
            label="Gambar Header (Opsional)"
            defaultValue={initialData?.imageUrl}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Deskripsi Singkat
          </label>
          <textarea
            name="description"
            required
            defaultValue={initialData?.description}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Penjelasan singkat jurusan..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Materi Produktif / Kompetensi Unggulan
          </label>
          <textarea
            name="competencies"
            defaultValue={initialData?.competencies || ""}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Masukkan daftar kompetensi (pisahkan dengan baris baru/enter)&#10;Contoh:&#10;Instalasi Jaringan&#10;Administrasi Server&#10;Keamanan Jaringan"
          ></textarea>
          <p className="text-xs text-slate-500 mt-1">
            Satu kompetensi per baris.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Prospek Karir
          </label>
          <textarea
            name="careerProspects"
            defaultValue={initialData?.careerProspects || ""}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Masukkan daftar pekerjaan (pisahkan dengan baris baru/enter)&#10;Contoh:&#10;Network Engineer&#10;IT Support&#10;System Administrator"
          ></textarea>
          <p className="text-xs text-slate-500 mt-1">Satu profesi per baris.</p>
        </div>

        <div>
          <Editor
            name="content"
            label="Konten Lengkap (Tentang Jurusan)"
            defaultValue={initialData?.content || ""}
            disableMedia={true}
          />
          <p className="text-xs text-slate-500 mt-1">
            Anda bisa menggunakan format text (Bold, Italic, List, dll).
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> {isPending ? "Menyimpan..." : "Simpan Jurusan"}
          </button>
        </div>
      </form>
    </div>
  );
}
