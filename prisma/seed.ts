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
      description:
        "Kompetensi keahlian Teknik Kendaraan Ringan (TKR) menyiapkan siswa untuk menjadi mekanik profesional.",
      imageUrl:
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000",
      content: "<p>Detail lengkap tentang jurusan TKR...</p>",
      careerProspects: "Mekanik Otomotif\nTeknisi Perakitan\nWirausaha Bengkel",
      competencies:
        "Perawatan Mesin\nSistem Kelistrikan\nChassis & Pemindah Tenaga",
    },
    {
      name: "Teknik Komputer Jaringan",
      slug: "tkj",
      description:
        "TKJ berfokus pada instalasi, konfigurasi, dan maintenance jaringan komputer.",
      imageUrl:
        "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000",
      content: "<p>Detail lengkap tentang jurusan TKJ...</p>",
      careerProspects: "Network Engineer\nSystem Administrator\nIT Support",
      competencies:
        "Instalasi Jaringan LAN/WAN\nAdministrasi Server\nKeamanan Jaringan",
    },
    {
      name: "Akuntansi & Keuangan",
      slug: "akuntansi",
      description:
        "Mewujudkan tenaga kerja profesional di bidang keuangan yang teliti dan jujur.",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000",
      content: "<p>Detail lengkap tentang jurusan Akuntansi...</p>",
      careerProspects: "Staff Akuntansi\nKasir\nAdmin Keuangan",
      competencies: "Pembukuan Keuangan\nKomputer Akuntansi (MYOB)\nPerpajakan",
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
      content: "<p>Selamat datang di website resmi SMK Enscho...</p>",
    },
    {
      title: "Sejarah",
      slug: "sejarah",
      content: "<p>SMK Enscho didirikan pada tahun 2010...</p>",
    },
    {
      title: "Visi & Misi",
      slug: "visi-misi",
      content: "<p><strong>Visi:</strong> Menjadi SMK Unggulan...</p>",
    },
    {
      title: "Struktur Organisasi",
      slug: "struktur",
      content: "<p>Struktur Organisasi SMK Enscho...</p>",
    },
    {
      title: "Sarana & Prasarana",
      slug: "sarpras",
      content: "<p>Fasilitas lengkap untuk menunjang pembelajaran...</p>",
    },
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
    where: { email: "admin@enscho.sch.id" },
    update: {},
    create: {
      email: "admin@enscho.sch.id",
      name: "Admin Utama",
      password: "admin", // In real app, hash this!
      role: "ADMIN",
    },
  });

  // 5. School Features
  const features = [
    {
      title: "Kurikulum Merdeka",
      description:
        "Mengadopsi kurikulum terbaru yang fleksibel dan berpusat pada pengembangan minat serta bakat siswa.",
      icon: "BookOpen",
      color: "blue",
      order: 1,
    },
    {
      title: "Fasilitas Modern",
      description:
        "Dilengkapi laboratorium komputer canggih, bengkel praktik standar industri, dan ruang kelas multimedia.",
      icon: "Building2",
      color: "purple",
      order: 2,
    },
    {
      title: "Mitra Industri Luas",
      description:
        "Kerjasama dengan puluhan perusahaan ternama untuk program magang dan penyaluran kerja lulusan.",
      icon: "Users2",
      color: "green",
      order: 3,
    },
    {
      title: "Prestasi Unggulan",
      description:
        "Rekam jejak prestasi siswa di tingkat regional hingga nasional dalam berbagai bidang lomba.",
      icon: "Trophy",
      color: "amber",
      order: 4,
    },
    {
      title: "Sertifikasi Profesi",
      description:
        "Lulusan dibekali sertifikat kompetensi LSP yang diakui secara nasional maupun internasional.",
      icon: "Award",
      color: "red",
      order: 5,
    },
    {
      title: "Inkubator Bisnis",
      description:
        "Program kewirausahaan sekolah untuk mencetak lulusan yang siap membuka lapangan kerja sendiri.",
      icon: "Lightbulb",
      color: "cyan",
      order: 6,
    },
  ];

  for (const feature of features) {
    const existing = await prisma.schoolFeature.findFirst({
      where: { title: feature.title },
    });

    if (!existing) {
      await prisma.schoolFeature
        .create({ data: feature })
        .catch((e) =>
          console.log(`Skipping feature ${feature.title}: ${e.message}`)
        );
    }
  }

  // 6. Hero Slides
  // 6. Hero Slides
  const slides = [
    {
      title: "Selamat Datang di SMK Enscho",
      subtitle: "Membentuk Generasi Unggul, Berkarakter, dan Siap Kerja",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600",
      link: "/jurusan",
      order: 1,
      active: true,
    },
    {
      title: "Fasilitas Standar Industri",
      subtitle: "Menunjang pembelajaran praktek dengan peralatan terkini",
      imageUrl:
        "https://images.unsplash.com/photo-1581092918056-10f9563f6d4c?q=80&w=1600",
      link: "/fasilitas",
      order: 2,
      active: true,
    },
    {
      title: "PPDB Tahun Ajaran Baru",
      subtitle: "Segera daftarkan dirimu dan jadilah bagian dari kami",
      imageUrl:
        "https://images.unsplash.com/photo-1427504743055-e99aa7616eff?q=80&w=1600",
      link: "/ppdb",
      order: 3,
      active: true,
    },
  ];

  for (const slide of slides) {
    const existing = await prisma.heroSlide.findFirst({
      where: { title: slide.title },
    });
    if (!existing) {
      await prisma.heroSlide
        .create({ data: slide })
        .catch((e) =>
          console.log(`Skipping slide ${slide.title}: ${e.message}`)
        );
    }
  }

  // 7. Partners
  const partners = [
    {
      name: "Tech Corp",
      logoUrl: "https://placehold.co/200x80/2563eb/white?text=TechCorp",
    },
    {
      name: "Auto Indo",
      logoUrl: "https://placehold.co/200x80/dc2626/white?text=AutoIndo",
    },
    {
      name: "Net Solution",
      logoUrl: "https://placehold.co/200x80/16a34a/white?text=NetSol",
    },
    {
      name: "Media Creative",
      logoUrl: "https://placehold.co/200x80/9333ea/white?text=MediaC",
    },
    {
      name: "Bank Syariah",
      logoUrl: "https://placehold.co/200x80/ca8a04/white?text=BankS",
    },
  ];

  for (const p of partners) {
    const existing = await prisma.partner.findFirst({
      where: { name: p.name },
    });
    if (!existing) {
      await prisma.partner
        .create({ data: p })
        .catch((e) => console.log(`Skipping partner ${p.name}: ${e.message}`));
    }
  }

  // 8. Headmaster (Employee)
  const headmaster = await prisma.employee.findFirst({
    where: { category: "KEPSEK" },
  });
  if (!headmaster) {
    await prisma.employee
      .create({
        data: {
          name: "Dr. Budi Santoso, M.Pd",
          position: "Kepala Sekolah",
          category: "KEPSEK",
          imageUrl:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400",
        },
      })
      .catch((e) => console.log(`Skipping headmaster: ${e.message}`));
  } else {
    // 1. Remove duplicate 'sambutan-kepala-sekolah' if it exists (we use 'sambutan' now)
    // We already seeded 'sambutan' in step 3.
    await prisma.page
      .delete({
        where: { slug: "sambutan-kepala-sekolah" },
      })
      .catch(() => {});

    // 2. Ensure 'sambutan' exists (fallback)
    const page = await prisma.page.findUnique({
      where: { slug: "sambutan" },
    });
    if (!page) {
      await prisma.page
        .create({
          data: {
            title: "Sambutan Kepala Sekolah",
            slug: "sambutan",
            content:
              "<p>Selamat datang di website resmi SMK Enscho. Kami berkomitmen untuk...</p>",
          },
        })
        .catch((e) => console.log(`Skipping sambutan page: ${e.message}`));
    }
  }

  // 9. Posts (News)
  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@enscho.sch.id" },
  });
  const postsData = [
    {
      title: "Juara 1 LKS Tingkat Provinsi",
      slug: "juara-1-lks-provinsi",
      excerpt:
        "Siswa SMK Enscho kembali menorehkan prestasi membanggakan di ajang LKS...",
      content: "<p>Berita lengkap tentang juara LKS...</p>",
      published: true,
      category: "news",
      authorId: adminUser?.id,
      imageUrl:
        "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=800",
    },
    {
      title: "Kunjungan Industri ke Jakarta",
      slug: "kunjungan-industri-jakarta",
      excerpt:
        "Siswa kelas XI melakukan kunjungan industri ke beberapa perusahaan teknologi...",
      content: "<p>Berita lengkap kunjungan industri...</p>",
      published: true,
      category: "agenda",
      authorId: adminUser?.id,
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
    },
    {
      title: "Penerimaan Peserta Didik Baru Gelombang 1",
      slug: "ppdb-gelombang-1",
      excerpt:
        "Telah dibuka pendaftaran siswa baru gelombang pertama tahun ajaran...",
      content: "<p>Info lengkap PPDB...</p>",
      published: true,
      category: "news",
      authorId: adminUser?.id,
      imageUrl:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800",
    },
  ];

  if (adminUser) {
    for (const post of postsData) {
      await prisma.post
        .upsert({
          where: { slug: post.slug },
          update: {},
          create: post,
        })
        .catch((e) => console.log(`Skipping post ${post.title}: ${e.message}`));
    }
  }

  // 10. Employees (Guru & Staff)
  const employees = [
    {
      name: "Siti Aminah, S.Pd",
      position: "Guru Matematika / Waka Kurikulum",
      category: "GURU",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
      order: 2,
    },
    {
      name: "Ahmad Rizki, S.T",
      position: "Kaprodi TKR",
      category: "GURU",
      imageUrl:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400",
      order: 3,
    },
    {
      name: "Dewi Ratna, S.Kom",
      position: "Kaprodi TKJ",
      category: "GURU",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
      order: 4,
    },
    {
      name: "Budi Utomo",
      position: "Kepala Tata Usaha",
      category: "STAF",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
      order: 5,
    },
  ];

  for (const emp of employees) {
    // Check by name as simplistic unique check
    const existing = await prisma.employee.findFirst({
      where: { name: emp.name },
    });
    if (!existing) {
      await prisma.employee
        .create({ data: emp })
        .catch((e) => console.log(`Skipping emp ${emp.name}: ${e.message}`));
    }
  }

  // 11. Gallery
  const galleryItems = [
    {
      title: "Upacara Bendera",
      imageUrl:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800",
      category: "Kegiatan",
    },
    {
      title: "Praktek Bengkel TKR",
      imageUrl:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800",
      category: "Pembelajaran",
    },
    {
      title: "Laboratorium Komputer",
      imageUrl:
        "https://images.unsplash.com/photo-1504384308090-c54be3853247?q=80&w=800",
      category: "Fasilitas",
    },
    {
      title: "Juara Lomba Voli",
      imageUrl:
        "https://images.unsplash.com/photo-1612872087720-bc2d6199bc8d?q=80&w=800",
      category: "Prestasi",
    },
    {
      title: "Kunjungan Industri",
      imageUrl:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800",
      category: "Kegiatan",
    },
  ];

  for (const item of galleryItems) {
    const existing = await prisma.gallery.findFirst({
      where: { title: item.title },
    });
    if (!existing) {
      await prisma.gallery
        .create({ data: item })
        .catch((e) =>
          console.log(`Skipping gallery ${item.title}: ${e.message}`)
        );
    }
  }

  // 12. Documents
  const documents = [
    {
      title: "Brosur PPDB 2024",
      fileUrl: "/files/brosur-ppdb.pdf",
      size: "2.5 MB",
      category: "Informasi",
    },
    {
      title: "Kalender Akademik 2023/2024",
      fileUrl: "/files/kalender-akademik.pdf",
      size: "1.2 MB",
      category: "Akademik",
    },
    {
      title: "Formulir Pendaftaran Manual",
      fileUrl: "/files/form-pendaftaran.pdf",
      size: "500 KB",
      category: "Administrasi",
    },
    {
      title: "Tata Tertib Siswa",
      fileUrl: "/files/tata-tertib.pdf",
      size: "800 KB",
      category: "Akademik",
    },
  ];

  for (const doc of documents) {
    const existing = await prisma.document.findFirst({
      where: { title: doc.title },
    });
    if (!existing) {
      await prisma.document
        .create({ data: doc })
        .catch((e) => console.log(`Skipping doc ${doc.title}: ${e.message}`));
    }
  }

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
