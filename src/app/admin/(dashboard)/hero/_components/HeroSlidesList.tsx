"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, MoveUp, MoveDown, Eye, EyeOff } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  order: number;
  active: boolean;
}

interface HeroSlidesListProps {
  slides: HeroSlide[];
  onDelete: (id: string) => Promise<void>;
  onUpdateOrder: (id: string, direction: "up" | "down") => Promise<void>;
}

export default function HeroSlidesList({
  slides,
  onDelete,
  onUpdateOrder,
}: HeroSlidesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus slide "${title}"?`)) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (slides.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <div className="flex flex-col items-center text-slate-400">
          <Eye size={48} className="mb-3" />
          <p className="text-sm font-medium">Belum ada slide hero</p>
          <p className="text-xs text-slate-400 mt-1">
            Klik "Tambah Slide" untuk membuat slide baru
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase w-16">
                Urutan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                Preview
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                Judul & Subtitle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                Link
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slides.map((slide, index) => (
              <tr
                key={slide.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => onUpdateOrder(slide.id, "up")}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Pindah ke atas"
                    >
                      <MoveUp size={16} />
                    </button>
                    <span className="text-sm font-medium text-center">
                      {slide.order}
                    </span>
                    <button
                      onClick={() => onUpdateOrder(slide.id, "down")}
                      disabled={index === slides.length - 1}
                      className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Pindah ke bawah"
                    >
                      <MoveDown size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative w-32 h-20 bg-slate-100 rounded-lg overflow-hidden">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{slide.title}</p>
                    {slide.subtitle && (
                      <p className="text-sm text-slate-500 mt-1">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {slide.link ? (
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {slide.link.length > 30
                        ? slide.link.substring(0, 30) + "..."
                        : slide.link}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {slide.active ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        <Eye size={12} />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <EyeOff size={12} />
                        Tidak Aktif
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/hero/${slide.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(slide.id, slide.title)}
                      disabled={deletingId === slide.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
