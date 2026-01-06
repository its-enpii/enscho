import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { updateMajor } from "../../actions";
import MajorForm from "../../_components/MajorForm";

export default async function EditMajorPage({
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

  // Explicitly cast to any to bypass stale TypeScript definitions
  const major = (await prisma.major.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      content: true,
      careerProspects: true,
      competencies: true,
      authorId: true,
    },
  })) as any;

  if (!major) notFound();

  // Authorization check for viewing/editing
  if (!canManageAll && major.authorId !== currentUserId) {
    redirect("/admin/jurusan");
  }

  const updateAction = updateMajor.bind(null, id);

  return (
    <MajorForm
      action={updateAction}
      initialData={major}
      titleText={`Edit Jurusan: ${major.name}`}
    />
  );
}
