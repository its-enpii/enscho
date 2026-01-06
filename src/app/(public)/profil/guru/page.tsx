import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Users, UserCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GuruPage() {
  const employees = await prisma.employee.findMany({
    orderBy: [
      { category: "asc" }, // Order: GURU starts with G, KEPSEK with K, STAF with S.
      // KEPSEK Should be first? Alphabetically G comes before K.
      // Maybe we need custom sort order, but for now simple ASC.
      { order: "asc" },
    ],
  });

  // Manual sorting to ensure KEPSEK -> GURU -> STAF if needed, but let's trust the data for now or do client side grouping.
  // Actually, let's group them for better display.

  const kepsek = employees.filter((e) => e.category === "KEPSEK");
  const teachers = employees.filter((e) => e.category === "GURU");
  const staff = employees.filter((e) => e.category === "STAF");

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16 relative overflow-hidden border-b border-white/10">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dewan Guru & Staf
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Mengenal lebih dekat para pendidik dan tenaga kependidikan SMK
            Enscho yang berdedikasi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Kepala Sekolah */}
        {kepsek.length > 0 && (
          <section className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-10 flex items-center justify-center gap-3">
              <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
              Pimpinan Sekolah
              <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
            </h2>
            <div className="flex justify-center">
              {kepsek.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 max-w-sm w-full hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-blue-50 mb-6 shadow-inner">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <UserCircle size={64} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {p.position || "Kepala Sekolah"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guru */}
        {teachers.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-10 text-center">
              Guru & Pengajar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teachers.map((t) => (
                <EmployeeCard key={t.id} employee={t} />
              ))}
            </div>
          </section>
        )}

        {/* Staf */}
        {staff.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-10 text-center">
              Tata Usaha & Staf
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {staff.map((s) => (
                <EmployeeCard key={s.id} employee={s} />
              ))}
            </div>
          </section>
        )}

        {employees.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              Belum ada data guru dan staf yang ditampilkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployeeCard({ employee }: { employee: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-64 bg-slate-100 overflow-hidden relative">
        {employee.imageUrl ? (
          <img
            src={employee.imageUrl}
            alt={employee.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <UserCircle size={64} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="text-white text-sm font-medium px-3 py-1 bg-blue-600/90 rounded-full backdrop-blur-sm">
            {employee.category === "GURU" ? "Pengajar" : "Staf"}
          </span>
        </div>
      </div>
      <div className="p-5 text-center">
        <h3
          className="font-bold text-slate-900 mb-1 line-clamp-1"
          title={employee.name}
        >
          {employee.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-1">
          {employee.position || "-"}
        </p>
      </div>
    </div>
  );
}
