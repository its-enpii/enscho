import { prisma } from "@/lib/prisma";
import { FeatureForm } from "@/components/admin/FeatureForm";
import { notFound } from "next/navigation";

export default async function EditFeaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const feature = await prisma.schoolFeature.findUnique({
    where: { id },
  });

  if (!feature) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Edit Keunggulan</h1>
        <p className="text-slate-500 text-sm">
          Perbarui informasi keunggulan sekolah.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <FeatureForm initialData={feature} />
      </div>
    </div>
  );
}
