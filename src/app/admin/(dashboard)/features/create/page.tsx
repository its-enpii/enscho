import { FeatureForm } from "@/components/admin/FeatureForm";

export default function CreateFeaturePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Tambah Keunggulan Baru
        </h1>
        <p className="text-slate-500 text-sm">
          Tambahkan poin keunggulan sekolah untuk ditampilkan di halaman depan.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <FeatureForm />
      </div>
    </div>
  );
}
