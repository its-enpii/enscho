export const SCHOOL_INFO = {
  name: "SMK Enscho",
  phone: "+62 812 3456 7890",
  email: "info@enscho.sch.id",
  address: "Jl. Pendidikan No. 1, Jakarta",
  socials: {
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
  },
  socialMedia: [],
  logoUrl: null,
  bannerUrl: null,
  tagline: null,
  footerDescription: null,
  primaryColor: "#2563eb", // blue-600
  openingHours: "Senin - Jumat: 07:00 - 16:00\nSabtu: 07:00 - 12:00",

  welcomeTitle: null,
  welcomeDescription: null,
  statsStudents: null,
  statsTeachers: null,
  statsPartners: null,
};

export const NAVIGATION_MENU = [
  { label: "Beranda", href: "/" },
  {
    label: "Profil Sekolah",
    href: "/profil",
    children: [
      { label: "Sambutan Kepala Sekolah", href: "/profil/sambutan" },
      { label: "Sejarah", href: "/profil/sejarah" },
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Struktur Organisasi", href: "/profil/struktur" },
      { label: "Guru & Staf", href: "/profil/guru" },
      { label: "Sarana & Prasarana", href: "/profil/sarpras" },
    ],
  },
  {
    label: "Kompetensi Keahlian",
    href: "/jurusan",
    children: [
      { label: "Teknik Kendaraan Ringan", href: "/jurusan/tkr" },
      { label: "Teknik Komputer Jaringan", href: "/jurusan/tkj" },
      { label: "Akuntansi", href: "/jurusan/akuntansi" },
    ],
  },
  {
    label: "Hubin & BKK",
    href: "/hubin",
    children: [
      { label: "Mitra Industri", href: "/hubin/mitra" },
      { label: "Info Lowongan Kerja", href: "/hubin/loker" },
    ],
  },
  {
    label: "Akademik",
    href: "/akademik",
  },
  {
    label: "Galeri & Berita",
    href: "/berita",
  },
  {
    label: "Kontak",
    href: "/kontak",
  },
];
