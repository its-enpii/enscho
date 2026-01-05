"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

interface Page {
  id: string;
  title: string;
  slug: string;
  updatedAt: Date;
  authorId?: string | null;
}

interface PagesTableProps {
  pages: Page[];
  protectedSlugs: string[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  currentUserId: string;
  canManageAll: boolean;
}

export default function PagesTable({
  pages,
  protectedSlugs,
  onDelete,
  currentUserId,
  canManageAll,
}: PagesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPages = filteredPages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
              placeholder="Cari judul atau slug..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Menampilkan {paginatedPages.length} dari {filteredPages.length}{" "}
            halaman
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Judul Halaman
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Terakhir Diupdate
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <FileText size={48} className="mb-3" />
                      <p className="text-sm font-medium">
                        {searchQuery ? "Tidak ada hasil" : "Belum ada halaman"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPages.map((page) => {
                  const isProtected = protectedSlugs.includes(page.slug);
                  return (
                    <tr
                      key={page.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">
                            {page.title}
                          </p>
                          {isProtected && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                          {page.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(page.updatedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {canManageAll || page.authorId === currentUserId ? (
                            <>
                              <Link
                                href={`/admin/pages/${page.id}/edit`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                              {!isProtected && (
                                <button
                                  onClick={async () => {
                                    if (
                                      confirm(
                                        `Yakin ingin menghapus "${page.title}"?`
                                      )
                                    ) {
                                      const result = await onDelete(page.id);
                                      if (!result.success) {
                                        alert(
                                          result.error ||
                                            "Gagal menghapus halaman"
                                        );
                                      }
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded-md">
                              View Only
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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
