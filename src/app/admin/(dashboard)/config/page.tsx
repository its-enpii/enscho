import { prisma } from "@/lib/prisma";
import { getSchoolConfig } from "@/services/school";
import { revalidatePath } from "next/cache";
import ConfigForm from "./_components/ConfigForm";

export default async function AdminConfigPage() {
  // Ensure we have current config
  const config = await getSchoolConfig();

  async function updateConfig(formData: FormData) {
    "use server";

    // Parse socials
    const socialMediaRaw = formData.get("socialMedia") as string;
    let socialMediaJson = [];
    try {
      socialMediaJson = JSON.parse(socialMediaRaw);
    } catch (e) {
      socialMediaJson = [];
    }

    // Handle File Uploads
    const { saveFile, deleteFile } = await import("@/lib/file-upload");

    // Get current config to check for existing files
    const currentConfig = await prisma.schoolConfig.findUnique({
      where: { id: "config" },
      select: { logoUrl: true, logoIconUrl: true },
    });

    const logoFile = formData.get("logo") as File;
    let logoUrl = null;
    if (logoFile && logoFile.size > 0) {
      // Delete old logo if exists
      if (currentConfig?.logoUrl) {
        await deleteFile(currentConfig.logoUrl);
      }
      logoUrl = await saveFile(logoFile, "config");
    }

    const logoIconFile = formData.get("logoIcon") as File;
    let logoIconUrl = null;
    if (logoIconFile && logoIconFile.size > 0) {
      // Delete old logo icon if exists
      if (currentConfig?.logoIconUrl) {
        await deleteFile(currentConfig.logoIconUrl);
      }
      logoIconUrl = await saveFile(logoIconFile, "config");
    }

    const updateData: any = {
      name: formData.get("name") as string,
      slogan: formData.get("slogan") as string,
      footerDescription: formData.get("footerDescription") as string,
      primaryColor: formData.get("primaryColor") as string,
      openingHours: formData.get("openingHours") as string,

      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      socialMedia: socialMediaJson,

      // School Profile Content
      history: formData.get("history") as string,
      vision: formData.get("vision") as string,
    };

    if (logoUrl) updateData.logoUrl = logoUrl;
    if (logoIconUrl) updateData.logoIconUrl = logoIconUrl;

    await prisma.schoolConfig.upsert({
      where: { id: "config" },
      update: updateData,
      create: {
        ...updateData,
        id: "config",
      },
    });

    revalidatePath("/");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Konfigurasi Sekolah
      </h1>
      <ConfigForm initialData={config} action={updateConfig} />
    </div>
  );
}
