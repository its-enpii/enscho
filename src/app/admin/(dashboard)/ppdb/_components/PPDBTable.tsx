"use client";

import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

interface Registration {
  id: string;
  registrationNo: string;
  namaLengkap: string;
  asalSekolah: string;
  status: string;
  createdAt: Date;
  pilihanJurusan1: { name: string } | null;
}

interface PPDBTableProps {
  registrations: Registration[];
}

export default function PPDBTable({ registrations }: PPDBTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique years from registrations
  const availableYears = Array.from(
    new Set(
      registrations.map((reg) =>
        new Date(reg.createdAt).getFullYear().toString()
      )
    )
  ).sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending (newest first)

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.asalSekolah.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || reg.status === statusFilter;
    const matchesYear =
      yearFilter === "ALL" ||
      new Date(reg.createdAt).getFullYear().toString() === yearFilter;
    return matchesSearch && matchesStatus && matchesYear;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegistrations = filteredRegistrations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: Clock,
      },
      VERIFIED: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: CheckCircle2,
      },
      ACCEPTED: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle2,
      },
      REJECTED: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle,
      },
    };
    return (
      styles[status as keyof typeof styles] || {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
        icon: Clock,
      }
    );
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: "Menunggu",
      VERIFIED: "Terverifikasi",
      ACCEPTED: "Diterima",
      REJECTED: "Ditolak",
    };
    return labels[status as keyof typeof labels] || status;
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
              placeholder="Cari nama, no. daftar, atau asal sekolah..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="md:w-48 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Menunggu</option>
            <option value="VERIFIED">Terverifikasi</option>
            <option value="ACCEPTED">Diterima</option>
            <option value="REJECTED">Ditolak</option>
          </select>
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="md:w-40 px-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          >
            <option value="ALL">Semua Tahun</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Menampilkan {paginatedRegistrations.length} dari{" "}
            {filteredRegistrations.length} pendaftar
          </p>
          {(searchQuery || statusFilter !== "ALL" || yearFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setYearFilter("ALL");
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
                  No. Daftar
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Nama Lengkap
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Asal Sekolah
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Jurusan 1
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                  Status
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
              {paginatedRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <UserPlus size={48} className="mb-3" />
                      <p className="text-sm font-medium">
                        {searchQuery || statusFilter !== "ALL"
                          ? "Tidak ada hasil"
                          : "Belum ada pendaftar"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRegistrations.map((reg) => {
                  const statusStyle = getStatusBadge(reg.status);
                  const StatusIcon = statusStyle.icon;
                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                          {reg.registrationNo}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {reg.namaLengkap}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {reg.asalSekolah}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {reg.pilihanJurusan1?.name || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <StatusIcon size={12} />
                          {getStatusLabel(reg.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <Link
                            href={`/admin/ppdb/${reg.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </Link>
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
