import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { saveFile } from "@/lib/upload";
import Editor from "@/components/ui/Editor";
import ImageUpload from "@/components/ui/ImageUpload";
import { cookies } from "next/headers";

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

  async function updateMajor(formData: FormData) {
    "use server";

    // Authorization check again in server action
    if (!canManageAll && major?.authorId !== currentUserId) {
      throw new Error("Unauthorized");
    }

    const imageFile = formData.get("image") as File;
    let imageUrl = major.imageUrl || "";

    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, "jurusan");
    }

    await prisma.major.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        imageUrl,
        content: formData.get("content") as string,
        careerProspects: formData.get("careerProspects") as string,
        competencies: formData.get("competencies") as string,
      } as any,
    });

    // Revalidate global layout to update navigation menu and homepage
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");

    redirect("/admin/jurusan");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/jurusan"
        className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Kembali
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Edit Jurusan: {major.name}
      </h1>

      <form
        action={updateMajor}
        className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Jurusan
            </label>
            <input
              name="name"
              defaultValue={major.name}
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug URL
            </label>
            <input
              name="slug"
              defaultValue={major.slug}
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <ImageUpload
            name="image"
            label="Gambar Header"
            defaultValue={major.imageUrl}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Deskripsi Singkat
          </label>
          <textarea
            name="description"
            defaultValue={major.description}
            required
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Materi Produktif / Kompetensi Unggulan
          </label>
          <textarea
            name="competencies"
            defaultValue={major.competencies || ""}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Satu baris per item"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Prospek Karir
          </label>
          <textarea
            name="careerProspects"
            defaultValue={major.careerProspects || ""}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Satu baris per item"
          ></textarea>
        </div>

        <div>
          <Editor
            name="content"
            defaultValue={major.content || ""}
            label="Konten Lengkap (Tentang Jurusan)"
            disableMedia={true}
          />
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
