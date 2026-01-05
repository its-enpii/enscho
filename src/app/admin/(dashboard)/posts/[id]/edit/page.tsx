import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Editor from "@/components/ui/Editor";
import { saveFile } from "@/lib/upload";
import ImageUpload from "@/components/ui/ImageUpload";
import { cookies } from "next/headers";

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

  async function updatePost(formData: FormData) {
    "use server";

    // Authorization check again in server action
    if (!canManageAll && post?.authorId !== currentUserId) {
      throw new Error("Unauthorized");
    }

    // Handle Image Upload
    const imageFile = formData.get("image") as File;
    let imageUrl = post?.imageUrl || "";

    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, "posts");
    }

    await prisma.post.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        category: formData.get("category") as string,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        published: formData.get("published") === "on",
        imageUrl,
      },
    });

    redirect("/admin/posts");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/posts"
        className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Berita</h1>

      <form
        action={updatePost}
        className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Judul Berita
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={post.title || ""}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug URL
            </label>
            <input
              name="slug"
              type="text"
              required
              defaultValue={post.slug || ""}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kategori
            </label>
            <select
              name="category"
              defaultValue={post.category || ""}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="news">Berita</option>
              <option value="article">Artikel</option>
              <option value="agenda">Agenda</option>
              <option value="loker">Info Loker</option>
            </select>
          </div>
        </div>

        <div>
          <ImageUpload
            name="image"
            label="Gambar Utama"
            defaultValue={post.imageUrl || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ringkasan (Excerpt)
          </label>
          <textarea
            name="excerpt"
            required
            rows={3}
            defaultValue={post.excerpt || ""}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <div>
          <Editor
            name="content"
            label="Konten Lengkap"
            defaultValue={post.content}
            disableMedia={true}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={post.published}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="published"
            className="text-sm font-medium text-slate-700"
          >
            Publikasikan sekarang?
          </label>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
