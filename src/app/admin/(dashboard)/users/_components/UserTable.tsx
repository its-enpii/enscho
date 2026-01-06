"use client";

import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: { posts: number };
}

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function UserTable({ users, onDelete }: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
      TEACHER: "bg-blue-100 text-blue-700 border-blue-200",
      STUDENT: "bg-green-100 text-green-700 border-green-200",
      ALUMNI: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return badges[role as keyof typeof badges] || "bg-slate-100 text-slate-700";
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: "Administrator",
      TEACHER: "Guru",
      STUDENT: "Siswa",
      ALUMNI: "Alumni",
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>

          {/* Role Filter */}
          <div className="md:w-64 relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="ALL">Semua Role</option>
              <option value="ADMIN">Administrator</option>
              <option value="TEACHER">Guru</option>
              <option value="STUDENT">Siswa</option>
              <option value="ALUMNI">Alumni</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Menampilkan {paginatedUsers.length} dari {filteredUsers.length}{" "}
            pengguna
            {searchQuery && ` untuk "${searchQuery}"`}
          </p>
          {(searchQuery || roleFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("ALL");
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Artikel
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Terdaftar
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search size={48} className="mb-3" />
                      <p className="text-sm font-medium">
                        {searchQuery || roleFilter !== "ALL"
                          ? "Tidak ada hasil yang ditemukan"
                          : "Belum ada pengguna"}
                      </p>
                      <p className="text-xs mt-1">
                        {searchQuery || roleFilter !== "ALL"
                          ? "Coba ubah kata kunci atau filter"
                          : 'Klik "Tambah Pengguna" untuk membuat akun baru'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onDelete={onDelete}
                    getRoleBadge={getRoleBadge}
                    getRoleLabel={getRoleLabel}
                  />
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
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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

// Separate component for user row to avoid client/server issues
function UserRow({
  user,
  onDelete,
  getRoleBadge,
  getRoleLabel,
}: {
  user: User;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  getRoleBadge: (role: string) => string;
  getRoleLabel: (role: string) => string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm } = useConfirm();
  const { showSuccess, showError } = useToast();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Hapus Pengguna",
      message: `Yakin ingin menghapus pengguna "${user.name || user.email}"?`,
      confirmText: "Ya, Hapus",
      variant: "danger",
    });

    if (!isConfirmed) return;

    setIsDeleting(true);
    const result = await onDelete(user.id);
    if (!result.success) {
      showError(result.error || "Gagal menghapus pengguna");
      setIsDeleting(false);
    } else {
      showSuccess("Pengguna berhasil dihapus");
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-slate-600">
              {user.name?.charAt(0).toUpperCase() ||
                user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900">
              {user.name || "Tanpa Nama"}
            </p>
            <p className="text-xs text-slate-500">
              ID: {user.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-slate-700">{user.email}</p>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
            user.role
          )}`}
        >
          {getRoleLabel(user.role)}
        </span>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-slate-600">{user._count.posts} artikel</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-slate-600">
          {new Date(user.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <a
            href={`/admin/users/${user.id}/edit`}
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
          </a>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
        </div>
      </td>
    </tr>
  );
}
