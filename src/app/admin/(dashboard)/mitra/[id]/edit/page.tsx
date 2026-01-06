import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updatePartner } from "../../actions";
import PartnerForm from "../../_components/PartnerForm";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const partner = await prisma.partner.findUnique({
    where: { id },
  });

  if (!partner) {
    notFound();
  }

  const updateAction = updatePartner.bind(null, id);

  return (
    <PartnerForm
      action={updateAction}
      initialData={partner}
      titleText="Edit Mitra Industri"
    />
  );
}
