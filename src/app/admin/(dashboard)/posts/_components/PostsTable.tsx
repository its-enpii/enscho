"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { DeleteButtonInline } from "@/app/admin/components/DeleteButtonInline";

interface Post {
  id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: Date;
  authorId?: string | null;
  author: { name: string | null } | null;
}

interface PostsTableProps {
  posts: Post[];
  onDelete: (formData: FormData) => Promise<void>;
  currentUserId: string;
  canManageAll: boolean;
}

export default function PostsTable({
  posts,
  onDelete,
  currentUserId,
  canManageAll,
}: PostsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || post.category === categoryFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && post.published) ||
      (statusFilter === "DRAFT" && !post.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari judul berita..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              handleFilterChange();
            }}
            className="md:w-48 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="news">Berita</option>
            <option value="agenda">Agenda</option>
            <option value="announcement">Pengumuman</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              handleFilterChange();
            }}
            className="md:w-40 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Menampilkan {paginatedPosts.length} dari {filteredPosts.length}{" "}
            berita
          </p>
          {(searchQuery ||
            categoryFilter !== "ALL" ||
            statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("ALL");
                setStatusFilter("ALL");
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Judul
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Penulis
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <Search size={48} className="mb-3" />
                      <p className="text-sm font-medium">
                        {searchQuery ||
                        categoryFilter !== "ALL" ||
                        statusFilter !== "ALL"
                          ? "Tidak ada hasil"
                          : "Belum ada berita"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 line-clamp-2">
                        {post.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium capitalize">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {post.author?.name || "Tidak ada"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {canManageAll || post.authorId === currentUserId ? (
                          <>
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Link>
                            <form action={onDelete}>
                              <input type="hidden" name="id" value={post.id} />
                              <button
                                type="submit"
                                onClick={(e) => {
                                  if (
                                    !confirm(
                                      `Yakin ingin menghapus "${post.title}"?`
                                    )
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </form>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded-md">
                            View Only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
                <ChevronLeft size={16} />
                Sebelumnya
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Selanjutnya
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
