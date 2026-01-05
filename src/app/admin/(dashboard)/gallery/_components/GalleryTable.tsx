"use client";

import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: Date;
}

interface GalleryTableProps {
  items: GalleryItem[];
  onDelete: (id: string) => Promise<void>;
}

export default function GalleryTable({ items, onDelete }: GalleryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const itemsPerPage = 12;

  // Get unique categories
  const availableCategories = Array.from(
    new Set(items.map((item) => item.category))
  ).sort();

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari judul foto..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="md:w-48 px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          >
            <option value="ALL">Semua Kategori</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Menampilkan {paginatedItems.length} dari {filteredItems.length} foto
          </p>
          {(searchQuery || categoryFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("ALL");
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {paginatedItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <div className="flex flex-col items-center text-slate-400">
            <ImageIcon size={48} className="mb-3" />
            <p className="text-sm font-medium">
              {searchQuery || categoryFilter !== "ALL"
                ? "Tidak ada hasil"
                : "Belum ada foto"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-square bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-slate-900 mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3">{item.category}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/gallery/${item.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft size={16} /> Sebelumnya
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Selanjutnya <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
