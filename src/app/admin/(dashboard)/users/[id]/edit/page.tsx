import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateUser } from "../../actions";
import UserForm from "../../_components/UserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  const updateAction = updateUser.bind(null, id);

  return (
    <UserForm
      action={updateAction}
      initialData={user}
      titleText="Edit Pengguna"
      subtitleText="Perbarui informasi pengguna"
      isEdit={true}
    />
  );
}
