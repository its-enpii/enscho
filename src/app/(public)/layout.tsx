import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { NAVIGATION_MENU } from "@/lib/constants";
import { getSchoolConfig } from "@/services/school";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schoolConfig = await getSchoolConfig();
  const pages = await prisma.page.findMany({
    select: { title: true, slug: true }
  });
  const majors = await prisma.major.findMany({
    select: { name: true, slug: true }
  });

  // Construct dynamic menu
  const menuItems = NAVIGATION_MENU.map(item => {
      if (item.label === "Profil Sekolah") {
      // Define hardcoded pages that always exist
      const hardcodedPages = ['guru'];
      
      // Get all valid slugs (database pages + hardcoded)
      const validSlugs = [...pages.map(p => p.slug), ...hardcodedPages];

      // Filter pages that should NOT be in Profil menu manually (like home/akademik-landing)
      // AND ensure dynamic pages from DB are added
      const dynamicPagesToAdd = pages.filter(p => !['akademik-landing', 'home'].includes(p.slug));
      
      // Start with the static menu items defined in constants (which have specific labels)
      // But only keep those that actually exist (either hardcoded or in DB)
      const existingChildrenFiltered = (item.children || []).filter(child => {
         const slug = child.href.split('/').pop() || "";
         return validSlugs.includes(slug);
      });

      // Find which slugs are already covered
      const coveredSlugs = existingChildrenFiltered.map(c => c.href.split('/').pop());

      // Filter dynamic pages to only include those NOT already covered
      const newPages = dynamicPagesToAdd.filter(p => !coveredSlugs.includes(p.slug));

      return {
        ...item,
        children: [
            ...existingChildrenFiltered,
            ...newPages.map(page => ({
                label: page.title,
                href: `/profil/${page.slug}`
            }))
        ]
      };
    }
    if (item.label === "Kompetensi Keahlian") {
      return {
        ...item,
        children: majors.map(major => ({
          label: major.name,
          href: `/jurusan/${major.slug}`
        }))
      };
    }
    return item;
  });

  return (
    <>
      <TopBar schoolInfo={schoolConfig} />
      <Navbar schoolName={schoolConfig.name} logoUrl={schoolConfig.logoUrl} menuItems={menuItems} />
      <main className="min-h-screen bg-white">
          {children}
      </main>
      <Footer schoolInfo={schoolConfig} majors={majors} />
    </>
  );
}
