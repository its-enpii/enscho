import { prisma } from "@/lib/prisma";
import { getSchoolConfig } from "@/services/school";

import { HeroSection } from "@/components/home/HeroSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
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

  // 2. Fetch "Sambutan" Page Content
  const sambutanPage = await prisma.page.findUnique({
    where: { slug: "sambutan-kepala-sekolah" },
  });
  // Fallback content if empty
  const sambutanContent =
    sambutanPage?.content ||
    "<p>Selamat datang di website resmi kami. Kami berkomitmen mencetak lulusan berkualitas.</p>";

  // 3. Fetch Headmaster Photo (from Employee category 'KEPSEK')
  const headmaster = await prisma.employee.findFirst({
    where: { category: "KEPSEK" },
  });

  // 4. Fetch Stats Data (Prioritize Config, else Count)
  const defaultStats = {
    students: await prisma.user.count({ where: { role: "STUDENT" } }), // Fallback count
    teachers: await prisma.employee.count({
      where: { category: { not: "KEPSEK" } },
    }),
    partners: await prisma.partner.count(),
  };

  const stats = {
    students: schoolConfig.statsStudents || `${defaultStats.students}+`,
    teachers: schoolConfig.statsTeachers || defaultStats.teachers,
    partners: schoolConfig.statsPartners || `${defaultStats.partners}+`,
  };

  // 5. Fetch Majors
  const majors = await prisma.major.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  // 6. Fetch Latest News
  const latestPosts = await prisma.post.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  // 7. Fetch Partners
  const partners = await prisma.partner.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  // 8. Fetch School Features (Highlights)
  const features = await prisma.schoolFeature.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-white">
      <HeroSection
        slides={slides}
        fallbackBanner={schoolConfig.bannerUrl}
        tagline={schoolConfig.tagline}
      />

      <WelcomeSection
        content={sambutanContent}
        headmasterImage={headmaster?.imageUrl}
        welcomeTitle={schoolConfig.welcomeTitle}
        welcomeDescription={schoolConfig.welcomeDescription}
        stats={stats}
      />

      <FeatureSection features={features} />

      <MajorGrid majors={majors} />

      <CtaSection primaryColor={schoolConfig.primaryColor || "#2563eb"} />

      <NewsGrid posts={latestPosts} />

      <PartnerMarquee partners={partners} />
    </div>
  );
}
