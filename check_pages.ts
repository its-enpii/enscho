
import { prisma } from "./src/lib/prisma";

async function main() {
  const pages = await prisma.page.findMany();
  console.log("Existing Pages:");
  pages.forEach(p => console.log(`- ${p.title} (slug: ${p.slug})`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
