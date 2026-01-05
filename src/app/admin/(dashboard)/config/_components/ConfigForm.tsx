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
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Slogan / Tagline (Hero Text)
        </label>
        <input
          name="tagline"
          defaultValue={initialData.tagline || ""}
          placeholder="Contoh: Mewujudkan Generasi Unggul, Berkarakter, dan Siap Kerja"
          type="text"
          className="w-full px-3 py-2 border rounded-md"
        />
        <p className="text-xs text-slate-500 mt-1">
          Teks ini akan muncul di halaman depan (Hero Section) di bawah nama
          sekolah.
        </p>
      </div>

      <div className="pt-4 border-t space-y-4">
        <h3 className="font-medium text-slate-900">
          Bagian Sambutan (Welcome Section)
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Judul Sambutan
          </label>
          <input
            name="welcomeTitle"
            defaultValue={initialData.welcomeTitle || ""}
            placeholder="Contoh: Mencetak Generasi Juara"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Deskripsi Singkat
          </label>
          <textarea
            name="welcomeDescription"
            defaultValue={initialData.welcomeDescription || ""}
            placeholder="Contoh: Selamat datang di website resmi kami..."
            className="w-full px-3 py-2 border rounded-md"
            rows={2}
          ></textarea>
        </div>
      </div>

      <div className="pt-4 border-t space-y-4">
        <h3 className="font-medium text-slate-900">Statistik Sekolah</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Total Siswa
            </label>
            <input
              name="statsStudents"
              defaultValue={initialData.statsStudents || "1000+"}
              type="text"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Total Guru & Staf
            </label>
            <input
              name="statsTeachers"
              defaultValue={initialData.statsTeachers || "50+"}
              type="text"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Total Mitra
            </label>
            <input
              name="statsPartners"
              defaultValue={initialData.statsPartners || "10+"}
              type="text"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Logo Sekolah
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
              {/* We use a simple img tag that defaults to initialData if available. 
                      Ideally we'd use state for preview like EmployeeForm, but let's keep it simple for now or implement preview if requested.
                      Actually, better to add preview for UX. */}
              {/* Placeholder for now, simplistic approach without heavy client state for file preview unless needed */}
              <span className="text-xs text-slate-400">Preview</span>
            </div>
            <input
              type="file"
              name="logo"
              accept="image/*"
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Format: PNG, JPG. Maks 2MB.
          </p>
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Banner Sekolah (Hero)
          </label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-20 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
              <span className="text-xs text-slate-400">Preview</span>
            </div>
            <input
              type="file"
              name="banner"
              accept="image/*"
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gambar utama di halaman depan jika slider kosong.
          </p>
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
