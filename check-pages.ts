import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    select: { id: true, title: true, slug: true },
  });

  console.log("All pages:");
  pages.forEach((p) => console.log(`- ${p.title} (slug: ${p.slug})`));

  // Check for duplicates by title
  const titleCounts = new Map();
  pages.forEach((p) => {
    titleCounts.set(p.title, (titleCounts.get(p.title) || 0) + 1);
  });

  const duplicateTitles = Array.from(titleCounts.entries()).filter(
    ([_, count]) => count > 1
  );

  if (duplicateTitles.length > 0) {
    console.log("\nDuplicate titles found:");
    duplicateTitles.forEach(([title, count]) => {
      console.log(`- "${title}" appears ${count} times`);
      const dupes = pages.filter((p) => p.title === title);
      dupes.forEach((d) => console.log(`  -> slug: ${d.slug}, id: ${d.id}`));
    });
  } else {
    console.log("\nNo duplicate titles found.");
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
