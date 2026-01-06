"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

interface SocialMediaItem {
  platform: string;
  url: string;
  icon?: string;
}

interface ConfigFormProps {
  initialData: any;
  action: (formData: FormData) => Promise<void>;
}

export default function ConfigForm({ initialData, action }: ConfigFormProps) {
  const [socials, setSocials] = useState<SocialMediaItem[]>(() => {
    if (Array.isArray(initialData.socialMedia)) {
      return initialData.socialMedia;
    }
    // Fallback migration from old columns if json is empty
    const oldSocials = [];
    if (initialData.facebook)
      oldSocials.push({ platform: "Facebook", url: initialData.facebook });
    if (initialData.instagram)
      oldSocials.push({ platform: "Instagram", url: initialData.instagram });
    if (initialData.youtube)
      oldSocials.push({ platform: "YouTube", url: initialData.youtube });
    if (initialData.tiktok)
      oldSocials.push({ platform: "TikTok", url: initialData.tiktok });
    return oldSocials;
  });

  const addSocial = () => {
    setSocials([...socials, { platform: "", url: "" }]);
  };

  const removeSocial = (index: number) => {
    const newSocials = [...socials];
    newSocials.splice(index, 1);
    setSocials(newSocials);
  };

  const updateSocial = (
    index: number,
    field: keyof SocialMediaItem,
    value: string
  ) => {
    const newSocials = [...socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setSocials(newSocials);
  };

  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData.logoUrl || null
  );

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use URL.createObjectURL for faster preview
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      // Clean up memory when component unmounts or preview changes
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <form
      action={async (formData) => {
        // Append JSON string for socials
        formData.append("socialMedia", JSON.stringify(socials));
        await action(formData);
        alert("Konfigurasi berhasil diperbarui!");
      }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nama Sekolah
        </label>
        <input
          name="name"
          defaultValue={initialData.name}
          type="text"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Slogan Sekolah
        </label>
        <input
          name="slogan"
          defaultValue={initialData.slogan || ""}
          placeholder="Contoh: Sekolah Pusat Keunggulan"
          type="text"
          className="w-full px-3 py-2 border rounded-md"
        />
        <p className="text-xs text-slate-500 mt-1">
          Slogan ini akan muncul pada judul tab browser (Nama Sekolah - Slogan).
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Warna Utama (Primary Color)
        </label>
        <div className="flex items-center gap-3">
          <input
            name="primaryColor"
            defaultValue={initialData.primaryColor || "#2563eb"}
            type="color"
            className="h-10 w-20 p-1 border rounded-md cursor-pointer"
          />
          <span className="text-sm text-slate-500">
            Pilih warna dominan untuk website.
          </span>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-medium text-slate-900 mb-4">Kontak & Alamat</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              No. Telepon
            </label>
            <input
              name="phone"
              defaultValue={initialData.phone}
              type="text"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              name="email"
              defaultValue={initialData.email}
              type="text"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-medium text-slate-900 mb-4">Footer & Alamat</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Deskripsi Singkat (Footer)
          </label>
          <textarea
            name="footerDescription"
            defaultValue={
              initialData.footerDescription ||
              "Mewujudkan generasi unggul yang siap kerja, cerdas, dan berkarakter melalui pendidikan vokasi berkualitas."
            }
            className="w-full px-3 py-2 border rounded-md"
            rows={2}
            placeholder="Deskripsi singkat yang muncul di bagian bawah halaman (footer)."
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Alamat Lengkap
          </label>
          <textarea
            name="address"
            defaultValue={initialData.address}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Jam Operasional
          </label>
          <textarea
            name="openingHours"
            defaultValue={
              initialData.openingHours ||
              "Senin - Jumat: 07:00 - 16:00\nSabtu: 07:00 - 12:00"
            }
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            placeholder="Contoh:\nSenin - Jumat: 07:00 - 16:00\nSabtu: 07:00 - 12:00"
          ></textarea>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan baris baru (Enter) untuk memisahkan jadwal.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t">
        <label className="block text-sm font-semibold text-slate-900 mb-4">
          Logo Sekolah
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-32 h-32 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group shadow-inner">
            {/* Checkerboard pattern for transparency */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "conic-gradient(#000 0.25turn, #fff 0.25turn 0.5turn, #000 0.5turn 0.75turn, #fff 0.75turn)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            {logoPreview ? (
              <img
                key={logoPreview}
                src={logoPreview}
                alt="Logo Preview"
                className="relative z-10 max-w-full max-h-full object-contain p-4 transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="relative z-10 text-center p-4">
                <span className="text-xs text-slate-400 font-medium">
                  Belum ada logo
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-2">
              <input
                type="file"
                name="logo"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-sm"
              >
                Pilih Logo Baru
              </label>

              {initialData.logoUrl && (
                <p className="text-[10px] text-slate-400 break-all max-w-xs">
                  File saat ini: {initialData.logoUrl}
                </p>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format: **PNG** (disarankan untuk background transparan) atau
              **JPG**.
              <br />
              Ukuran maksimal **2MB**.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Media Sosial
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Tambahkan link media sosial sekolah
            </p>
          </div>
          <button
            type="button"
            onClick={addSocial}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Tambah Media Sosial
          </button>
        </div>

        <div className="space-y-3">
          {socials.map((social, index) => (
            <div
              key={index}
              className="flex gap-3 items-start p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="w-1/3">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Platform
                </label>
                <input
                  type="text"
                  placeholder="Facebook, Instagram, dll"
                  value={social.platform}
                  onChange={(e) =>
                    updateSocial(index, "platform", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-slate-300 bg-white rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  URL / Link
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/namaakun"
                  value={social.url}
                  onChange={(e) => updateSocial(index, "url", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 bg-white rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => removeSocial(index)}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {socials.length === 0 && (
            <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-500">
                Belum ada media sosial ditambahkan.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Klik tombol "Tambah Media Sosial" untuk menambahkan
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        <Save size={18} /> Simpan Perubahan
      </button>
    </form>
  );
}
