import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { updatePage } from "../../actions";
import PageForm from "../../_components/PageForm";

export default async function EditPageForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const adminSession = cookieStore.get("admin_session")?.value;

  if (!session && !adminSession) {
    redirect("/admin/login");
  }

  const [currentUserId, currentRole] = session
    ? session.split(":")
    : ["", "ADMIN"];
  const canManageAll =
    currentRole === "ADMIN" ||
    currentRole === "TEACHER" ||
    currentRole === "ALUMNI" ||
    !!adminSession;

  const page = await prisma.page.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      authorId: true,
    },
  });

  if (!page) {
    notFound();
  }

  // Authorization check for viewing/editing
  if (!canManageAll && page.authorId !== currentUserId) {
    redirect("/admin/pages");
  }

  const updateAction = updatePage.bind(null, id);

  return (
    <PageForm
      action={updateAction}
      initialData={page}
      titleText="Edit Halaman"
    />
  );
}
