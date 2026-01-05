import { prisma } from "@/lib/prisma";
import { getSchoolConfig } from "@/services/school";

import { HeroSection } from "@/components/home/HeroSection";
import { FeatureSection } from "@/components/home/FeatureSection"; // NEW
import { MajorGrid } from "@/components/home/MajorGrid";
import { CtaSection } from "@/components/home/CtaSection"; // NEW
import { NewsGrid } from "@/components/home/NewsGrid";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";

export default async function Home() {
  const schoolConfig = await getSchoolConfig();

  // 1. Fetch Hero Slides
  const slides = await prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  // 2. Fetch Majors
  const majors = await prisma.major.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  // 3. Fetch Latest News
  const latestPosts = await prisma.post.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  // 4. Fetch Partners
  const partners = await prisma.partner.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  // 5. Fetch School Features (Highlights)
  const features = await (prisma as any).schoolFeature.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-white">
      <HeroSection slides={slides} />

      <FeatureSection features={features} />

      <MajorGrid majors={majors} />

      <CtaSection primaryColor={schoolConfig.primaryColor || "#2563eb"} />

      <NewsGrid posts={latestPosts} />

      <PartnerMarquee partners={partners} />
    </div>
  );
}
