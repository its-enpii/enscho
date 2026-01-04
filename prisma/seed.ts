import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. School Config
  const config = await prisma.schoolConfig.upsert({
    where: { id: "config" },
    update: {},
    create: {
      id: "config",
      name: "SMK Enscho",
      phone: "+62 812 3456 7890",
      email: "info@enscho.sch.id",
      address: "Jl. Pendidikan No. 1, Jakarta",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },
  });

  console.log({ config });

  // 2. Majors (Jurusan)
  const majorsData = [
    {
      name: "Teknik Kendaraan Ringan",
      slug: "tkr",
      description: "Kompetensi keahlian Teknik Kendaraan Ringan (TKR) menyiapkan siswa untuk menjadi mekanik profesional.",
      imageUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000",
      content: "<p>Detail lengkap tentang jurusan TKR...</p>"
    },
    {
      name: "Teknik Komputer Jaringan",
      slug: "tkj",
      description: "TKJ berfokus pada instalasi, konfigurasi, dan maintenance jaringan komputer.",
      imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000",
      content: "<p>Detail lengkap tentang jurusan TKJ...</p>"
    },
    {
      name: "Akuntansi & Keuangan",
      slug: "akuntansi",
      description: "Mewujudkan tenaga kerja profesional di bidang keuangan yang teliti dan jujur.",
      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000",
      content: "<p>Detail lengkap tentang jurusan Akuntansi...</p>"
    },
  ];

  for (const major of majorsData) {
    await prisma.major.upsert({
      where: { slug: major.slug },
      update: {},
      create: major,
    });
  }

  // 3. Pages (Static Content)
  const pagesData = [
    {
      title: "Sambutan Kepala Sekolah",
      slug: "sambutan",
      content: "<p>Selamat datang di website resmi SMK Enscho...</p>"
    },
    {
      title: "Sejarah",
      slug: "sejarah",
      content: "<p>SMK Enscho didirikan pada tahun 2010...</p>"
    },
    {
      title: "Visi & Misi",
      slug: "visi-misi",
      content: "<p><strong>Visi:</strong> Menjadi SMK Unggulan...</p>"
    }
  ];

  for (const page of pagesData) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  
  // 4. Admin User
  await prisma.user.upsert({
      where: { email: 'admin@enscho.sch.id' },
      update: {},
      create: {
          email: 'admin@enscho.sch.id',
          name: 'Admin Utama',
          password: 'admin', // In real app, hash this!
          role: 'ADMIN'
      }
  });

  console.log("Seeding finished.");
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
