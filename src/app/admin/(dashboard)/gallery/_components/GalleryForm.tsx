"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface GalleryFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    title: string;
    imageUrl: string;
    category: string;
  };
}

export default function GalleryForm({ action, initialData }: GalleryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar!");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB!");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(initialData?.imageUrl || "");
    // Reset file input
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile && !initialData?.imageUrl) {
      alert("Silakan pilih gambar!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Add file to formData if new file selected
    if (selectedFile) {
      formData.set("image", selectedFile);
    }

    try {
      await action(formData);
    } catch (error: any) {
      if (
        error.message === "NEXT_REDIRECT" ||
        error.digest?.startsWith("NEXT_REDIRECT")
      ) {
        // Redirecting, do not reset isSubmitting to prevent interaction
        return;
      }
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Judul Foto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          defaultValue={initialData?.title}
          required
          className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          placeholder="Contoh: Upacara Bendera 17 Agustus"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Kategori <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="category"
          defaultValue={initialData?.category}
          required
          className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          placeholder="Contoh: Kegiatan Sekolah, Ekstrakurikuler, Prestasi"
        />
        <p className="text-xs text-slate-500">
          Gunakan kategori yang sama untuk mengelompokkan foto
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Upload Gambar{" "}
          {!initialData && <span className="text-red-500">*</span>}
        </label>

        {!imagePreview ? (
          <div className="relative">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required={!initialData}
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-3 text-slate-400" />
                <p className="mb-2 text-sm text-slate-600">
                  <span className="font-semibold">Klik untuk upload</span> atau
                  drag & drop
                </p>
                <p className="text-xs text-slate-500">
                  PNG, JPG, JPEG (Max. 5MB)
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative aspect-video w-full bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
            {!selectedFile && initialData && (
              <div>
                <input
                  type="file"
                  id="image-upload-replace"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload-replace"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer font-medium"
                >
                  <Upload size={18} />
                  Ganti Gambar
                </label>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500">
          {selectedFile
            ? `File: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(
                2
              )} KB)`
            : "Pilih gambar untuk diupload"}
        </p>
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
          disabled={isSubmitting || (!selectedFile && !initialData?.imageUrl)}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          Simpan
        </button>
      </div>
    </form>
  );
}
