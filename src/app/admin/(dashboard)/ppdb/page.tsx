import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, CheckCircle2, XCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PPDBAdminPage() {
  const registrations = await prisma.studentRegistration.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      pilihanJurusan1: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Data Pendaftaran Siswa Baru (PPDB)
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Daftar</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Asal Sekolah</TableHead>
              <TableHead>Jurusan 1</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Belum ada data pendaftaran.
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-mono text-sm">
                    {reg.registrationNo}
                  </TableCell>
                  <TableCell className="font-medium">
                    {reg.namaLengkap}
                  </TableCell>
                  <TableCell>{reg.asalSekolah}</TableCell>
                  <TableCell>{reg.pilihanJurusan1?.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={reg.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/ppdb/${reg.id}`}
                      className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={18} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    VERIFIED: "bg-blue-100 text-blue-800 border-blue-200",
    ACCEPTED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };

  const icons = {
    PENDING: Clock,
    VERIFIED: CheckCircle2,
    ACCEPTED: CheckCircle2,
    REJECTED: XCircle,
  };

  const Icon = icons[status as keyof typeof icons] || Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
      }`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}
