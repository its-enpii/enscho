"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Employee {
  id: string;
  name: string;
  position: string | null;
  category: string;
  imageUrl: string | null;
  order: number;
}

interface EmployeesTableProps {
  employees: Employee[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function EmployeesTable({
  employees,
  onDelete,
}: EmployeesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || emp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
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
              placeholder="Cari nama atau jabatan..."
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
            className="md:w-48 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="KEPSEK">Kepala Sekolah</option>
            <option value="GURU">Guru</option>
            <option value="STAF">Staf</option>
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Menampilkan {paginatedEmployees.length} dari{" "}
            {filteredEmployees.length} data
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Jabatan
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <Users size={48} className="mb-3" />
                      <p className="text-sm font-medium">
                        {searchQuery || categoryFilter !== "ALL"
                          ? "Tidak ada hasil"
                          : "Belum ada data"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          {emp.imageUrl ? (
                            <img
                              src={emp.imageUrl}
                              alt={emp.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-full h-full p-2 text-slate-400" />
                          )}
                        </div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          emp.category === "KEPSEK"
                            ? "bg-purple-100 text-purple-700"
                            : emp.category === "GURU"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {emp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {emp.position || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/employees/${emp.id}/edit`}
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
                              confirm(`Yakin ingin menghapus "${emp.name}"?`)
                            ) {
                              await onDelete(emp.id);
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
