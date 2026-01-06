import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { updatePost } from "../../actions";
import PostForm from "../../_components/PostForm";

export default async function EditPostForm({
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

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      published: true,
      authorId: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Authorization check for viewing/editing
  if (!canManageAll && post.authorId !== currentUserId) {
    redirect("/admin/posts");
  }

  const updateAction = updatePost.bind(null, id);

  return (
    <PostForm
      action={updateAction}
      initialData={post}
      titleText="Edit Berita"
    />
  );
}
