import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeroSlideForm from "../../_components/HeroSlideForm";
import { notFound } from "next/navigation";
import { writeFile, unlink } from "fs/promises";
import path from "path";

async function updateHeroSlide(id: string, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const link = formData.get("link") as string;
  const isActive = formData.get("isActive") === "true";
  const image = formData.get("image") as File | null;

  let imageUrl: string | undefined;

  if (image && image.size > 0) {
    const oldSlide = await prisma.heroSlide.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    const timestamp = Date.now();
    const originalName = image.name.replace(/\s+/g, "-");
    const filename = `${timestamp}-${originalName}`;

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads", "hero");
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    imageUrl = `/uploads/hero/${filename}`;

    if (oldSlide?.imageUrl && oldSlide.imageUrl.startsWith("/uploads/")) {
      try {
        const oldFilepath = path.join(
          process.cwd(),
          "public",
          oldSlide.imageUrl
        );
        await unlink(oldFilepath);
      } catch (error) {
        console.error("Failed to delete old image:", error);
      }
    }
  }

  await prisma.heroSlide.update({
    where: { id },
    data: {
      title,
      subtitle: subtitle || null,
      link: link || null,
      active: isActive,
      ...(imageUrl && { imageUrl }),
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/admin/hero");
  // redirect("/admin/hero");
  return { success: true };
}

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const slide = await prisma.heroSlide.findUnique({
    where: { id },
  });

  if (!slide) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/hero"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={20} />
          Kembali ke Hero Slides
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Slide</h1>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui informasi hero slide
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <HeroSlideForm
          action={updateHeroSlide.bind(null, id)}
          initialData={slide as any}
        />
      </div>
    </div>
  );
}
