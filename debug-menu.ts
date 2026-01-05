import { prisma } from "./src/lib/prisma";
import { NAVIGATION_MENU } from "./src/lib/constants";

async function main() {
  const pages = await prisma.page.findMany({
    select: { title: true, slug: true },
  });

  console.log("Pages from DB:");
  pages.forEach((p) => console.log(`  - ${p.title} (${p.slug})`));

  // Simulate the layout logic
  const item = NAVIGATION_MENU.find((i) => i.label === "Profil Sekolah");

  if (item && item.children) {
    const hardcodedPages = ["guru"];
    const validSlugs = [...pages.map((p) => p.slug), ...hardcodedPages];

    console.log("\nValid slugs:", validSlugs);

    const dynamicPagesToAdd = pages.filter(
      (p) => !["akademik-landing", "home"].includes(p.slug)
    );
    console.log("\nDynamic pages to add:");
    dynamicPagesToAdd.forEach((p) => console.log(`  - ${p.title} (${p.slug})`));

    const existingChildrenFiltered = item.children.filter((child) => {
      const slug = child.href.split("/").pop() || "";
      const exists = validSlugs.includes(slug);
      console.log(
        `\nChecking constant: ${child.label} -> /profil/${slug} -> exists: ${exists}`
      );
      return exists;
    });

    console.log("\nExisting children filtered:");
    existingChildrenFiltered.forEach((c) =>
      console.log(`  - ${c.label} (${c.href})`)
    );

    const coveredSlugs = existingChildrenFiltered.map((c) =>
      c.href.split("/").pop()
    );
    console.log("\nCovered slugs:", coveredSlugs);

    const newPages = dynamicPagesToAdd.filter(
      (p) => !coveredSlugs.includes(p.slug)
    );
    console.log("\nNew pages to add:");
    newPages.forEach((p) => console.log(`  - ${p.title} (${p.slug})`));

    const finalChildren = [
      ...existingChildrenFiltered,
      ...newPages.map((page) => ({
        label: page.title,
        href: `/profil/${page.slug}`,
      })),
    ];

    console.log("\n=== FINAL MENU ===");
    finalChildren.forEach((c) => console.log(`  - ${c.label} (${c.href})`));

    // Check for duplicate labels
    const labelCounts = new Map();
    finalChildren.forEach((c) => {
      labelCounts.set(c.label, (labelCounts.get(c.label) || 0) + 1);
    });

    const duplicates = Array.from(labelCounts.entries()).filter(
      ([_, count]) => count > 1
    );
    if (duplicates.length > 0) {
      console.log("\n⚠️  DUPLICATE LABELS FOUND:");
      duplicates.forEach(([label, count]) =>
        console.log(`  - "${label}" appears ${count} times`)
      );
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
