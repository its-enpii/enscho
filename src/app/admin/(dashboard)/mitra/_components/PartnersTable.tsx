"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
}

interface PartnersTableProps {
  partners: Partner[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function PartnersTable({
  partners,
  onDelete,
}: PartnersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPartners = filteredPartners.slice(
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
              placeholder="Cari nama perusahaan..."
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
            Menampilkan {paginatedPartners.length} dari{" "}
            {filteredPartners.length} mitra
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
                  Logo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Nama Perusahaan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Website
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPartners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <Building2 size={48} className="mb-3" />
                      <p className="text-sm font-medium">
                        {searchQuery ? "Tidak ada hasil" : "Belum ada mitra"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-20 h-14 relative bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                        {partner.logoUrl ? (
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <Building2 className="text-slate-300" size={24} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {partner.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {partner.website}
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/mitra/${partner.id}/edit`}
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
                        <button
                          onClick={async () => {
                            if (
                              confirm(
                                `Yakin ingin menghapus "${partner.name}"?`
                              )
                            ) {
                              await onDelete(partner.id);
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
                      </div>
                    </td>
                  </tr>
                ))
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
