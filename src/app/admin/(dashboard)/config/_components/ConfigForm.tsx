"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Building2,
  MapPin,
  FileText,
  Share2,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

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
  const [activeTab, setActiveTab] = useState("basic");
  const { showSuccess, showError } = useToast();
  const [socials, setSocials] = useState<SocialMediaItem[]>(() => {
    if (Array.isArray(initialData.socialMedia)) {
      return initialData.socialMedia;
    }
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
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const tabs = [
    { id: "basic", label: "Informasi Dasar", icon: Building2 },
    { id: "contact", label: "Kontak & Alamat", icon: MapPin },
    { id: "profile", label: "Profil Sekolah", icon: FileText },
    { id: "social", label: "Media Sosial", icon: Share2 },
  ];

  return (
    <form
      action={async (formData) => {
        try {
          formData.append("socialMedia", JSON.stringify(socials));
          await action(formData);
          showSuccess("Konfigurasi berhasil diperbarui!");
        } catch (error) {
          showError("Gagal memperbarui konfigurasi. Silakan coba lagi.");
        }
      }}
      className="bg-white rounded-xl shadow-sm border border-slate-200"
    >
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 space-y-6">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <>
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
                Slogan ini akan muncul pada judul tab browser (Nama Sekolah -
                Slogan).
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

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-4">
                Logo Sekolah
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative w-32 h-32 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group shadow-inner">
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
                    Format: **PNG** (disarankan untuk background transparan)
                    atau **JPG**.
                    <br />
                    Ukuran maksimal **2MB**.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <>
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

            <div>
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

            <div>
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

            <div>
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
          </>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            <p className="text-sm text-slate-600 mb-4">
              Konten ringkasan untuk ditampilkan di halaman utama Profil. Untuk
              konten lengkap, gunakan menu <strong>Halaman (Pages)</strong>.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sejarah Singkat (Ringkasan)
              </label>
              <textarea
                name="history"
                defaultValue={
                  initialData.history ||
                  "Berdiri sejak tahun 2010, SMK Enscho telah meluluskan ribuan alumni yang tersebar di berbagai perusahaan multinasional. Dedikasi kami pada kualitas pendidikan dan pembentukan karakter menjadi fondasi utama."
                }
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Tuliskan ringkasan sejarah sekolah (1-2 paragraf)..."
              ></textarea>
              <p className="text-xs text-slate-500 mt-1">
                Ringkasan ini akan muncul di halaman <strong>/profil</strong>.
                Untuk konten lengkap, edit halaman "Sejarah" di menu Pages.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Visi Kami (Highlight)
              </label>
              <textarea
                name="vision"
                defaultValue={
                  initialData.vision ||
                  "Menjadi SMK Pusat Keunggulan yang menghasilkan tamatan kompeten, berakhlak mulia, dan berwawasan global."
                }
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Tuliskan visi sekolah (1 kalimat inti)..."
              ></textarea>
              <p className="text-xs text-slate-500 mt-1">
                Visi ini akan ditampilkan sebagai kutipan di halaman{" "}
                <strong>/profil</strong>. Untuk visi & misi lengkap, edit
                halaman "Visi Misi" di menu Pages.
              </p>
            </div>
          </>
        )}

        {/* Social Media Tab */}
        {activeTab === "social" && (
          <>
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
                      onChange={(e) =>
                        updateSocial(index, "url", e.target.value)
                      }
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
          </>
        )}
      </div>

      {/* Submit Button - Always Visible */}
      <div className="border-t border-slate-200 p-6">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>
    </form>
  );
}
