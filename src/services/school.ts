import { prisma } from "@/lib/prisma";
import { SCHOOL_INFO as DEFAULT_INFO } from "@/lib/constants";

export async function getSchoolConfig() {
  try {
    const config = await prisma.schoolConfig.findUnique({
      where: { id: "config" },
    });

    if (!config) return DEFAULT_INFO; // Fallback to constants if DB empty

    // Parse JSON if needed (although Prisma handles Json type automatically)
    const socialMedia = (config.socialMedia as any[]) || [];

    // Merge old fields if socialMedia is empty (migration fallback)
    if (socialMedia.length === 0) {
      if (config.facebook)
        socialMedia.push({ platform: "Facebook", url: config.facebook });
      if (config.instagram)
        socialMedia.push({ platform: "Instagram", url: config.instagram });
      if (config.youtube)
        socialMedia.push({ platform: "YouTube", url: config.youtube });
      if (config.tiktok)
        socialMedia.push({ platform: "TikTok", url: config.tiktok });
    }

    return {
      name: config.name,
      slogan: config.slogan,
      footerDescription: config.footerDescription,
      primaryColor: config.primaryColor || DEFAULT_INFO.primaryColor,
      openingHours: config.openingHours,

      statsStudents: config.statsStudents,
      statsTeachers: config.statsTeachers,
      statsPartners: config.statsPartners,

      phone: config.phone || DEFAULT_INFO.phone,
      email: config.email || DEFAULT_INFO.email,
      address: config.address || DEFAULT_INFO.address,
      socialMedia: socialMedia,
      logoUrl: config.logoUrl,

      // Keep 'socials' for backward compatibility check if needed, but we should switch fully.
      socials: {
        // Legacy support or just use the first item found for each platform
        facebook:
          socialMedia.find((s) => s.platform.toLowerCase() === "facebook")
            ?.url || "",
        instagram:
          socialMedia.find((s) => s.platform.toLowerCase() === "instagram")
            ?.url || "",
        youtube:
          socialMedia.find((s) => s.platform.toLowerCase() === "youtube")
            ?.url || "",
        tiktok:
          socialMedia.find((s) => s.platform.toLowerCase() === "tiktok")?.url ||
          "",
      },
    };
  } catch (error) {
    console.error("Failed to fetch school config:", error);
    return { ...DEFAULT_INFO, tagline: null };
  }
}
