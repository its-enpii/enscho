"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
  isAdmin: boolean;
}

export function ProfileForm({ user, isAdmin }: ProfileFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showSuccess("Profil berhasil diperbarui!");
        router.refresh();
        setShowPasswordSection(false);
      } else {
        showError(data.error || "Gagal memperbarui profil");
      }
    } catch (error) {
      showError("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAdmin) {
    return (
      <div className="p-6">
        <p className="text-slate-600">
          Anda login sebagai administrator. Profil tidak dapat diubah.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-slate-600">Data pengguna tidak ditemukan.</p>
      </div>
    );
  }

  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.image || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Profile Information */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Informasi Profil
        </h2>

        {/* Image Upload */}
        <div className="mb-6 flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Foto Profil
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
            />
            <p className="mt-1 text-xs text-slate-500">
              Format: JPG, PNG. Maksimal 2MB.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              defaultValue={user.name || ""}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Ubah Password
          </h2>
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showPasswordSection ? "Batal" : "Ubah Password"}
          </button>
        </div>

        {showPasswordSection && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password Lama
              </label>
              <input
                type="password"
                name="currentPassword"
                required={showPasswordSection}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password Baru
              </label>
              <input
                type="password"
                name="newPassword"
                required={showPasswordSection}
                minLength={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Minimal 6 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                name="confirmPassword"
                required={showPasswordSection}
                minLength={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
