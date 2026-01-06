import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeroSlideForm from "../_components/HeroSlideForm";
import { writeFile } from "fs/promises";
import path from "path";

async function createHeroSlide(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const link = formData.get("link") as string;
  const isActive = formData.get("isActive") === "true";
  const image = formData.get("image") as File;

  if (!image) {
    throw new Error("Image is required");
  }

  // Generate unique filename
  const timestamp = Date.now();
  const originalName = image.name.replace(/\s+/g, "-");
  const filename = `${timestamp}-${originalName}`;

  // Save file to public/uploads/hero
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "hero");
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  const imageUrl = `/uploads/hero/${filename}`;

  // Get max order
  const maxOrderSlide = await prisma.heroSlide.findFirst({
    orderBy: { order: "desc" },
  });
  const newOrder = (maxOrderSlide?.order || 0) + 1;

  await prisma.heroSlide.create({
    data: {
      title,
      subtitle: subtitle || null,
      imageUrl,
      link: link || null,
      order: newOrder,
      active: isActive,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/admin/hero");
  // redirect("/admin/hero");
  return { success: true };
}

export default function CreateHeroSlidePage() {
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
        <h1 className="text-2xl font-bold text-slate-900">Tambah Slide Baru</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tambahkan slide baru ke hero carousel
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <HeroSlideForm action={createHeroSlide} />
      </div>
    </div>
  );
}
