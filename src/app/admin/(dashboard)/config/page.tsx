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
    const saveFile = (await import("@/lib/file-upload")).saveFile; // Dynamic import to avoid server/client issues if any, or just standard import

    const logoFile = formData.get("logo") as File;
    const bannerFile = formData.get("banner") as File;

    const logoUrl = await saveFile(logoFile, "config");
    const bannerUrl = await saveFile(bannerFile, "config");

    const updateData: any = {
      name: formData.get("name") as string,
      tagline: formData.get("tagline") as string,
      footerDescription: formData.get("footerDescription") as string,
      primaryColor: formData.get("primaryColor") as string,
      openingHours: formData.get("openingHours") as string,

      welcomeTitle: formData.get("welcomeTitle") as string,
      welcomeDescription: formData.get("welcomeDescription") as string,
      statsStudents: formData.get("statsStudents") as string,
      statsTeachers: formData.get("statsTeachers") as string,
      statsPartners: formData.get("statsPartners") as string,

      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      socialMedia: socialMediaJson,
    };

    if (logoUrl) updateData.logoUrl = logoUrl;
    if (bannerUrl) updateData.bannerUrl = bannerUrl;

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
