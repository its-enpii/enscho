import { prisma } from "@/lib/prisma";
import { UserPlus, Clock, CheckCircle2, XCircle } from "lucide-react";
import PPDBTable from "./_components/PPDBTable";

export const dynamic = "force-dynamic";

export default async function PPDBAdminPage() {
  const registrations = await prisma.studentRegistration.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      pilihanJurusan1: true,
    },
  });

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === "PENDING").length,
    verified: registrations.filter((r) => r.status === "VERIFIED").length,
    accepted: registrations.filter((r) => r.status === "ACCEPTED").length,
    rejected: registrations.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Data Pendaftaran Siswa Baru (PPDB)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola dan verifikasi pendaftaran calon siswa baru
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserPlus size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Total Pendaftar
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Menunggu</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Terverifikasi
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.verified}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Diterima</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.accepted}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <XCircle size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Ditolak</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PPDBTable registrations={registrations} />
    </div>
  );
}
