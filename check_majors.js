const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkMajors() {
  const majors = await prisma.major.findMany();
  console.log("Majors:", JSON.stringify(majors, null, 2));
}

checkMajors()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
