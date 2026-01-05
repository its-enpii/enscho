import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Settings,
  Image as ImageIcon,
  Users,
  LogOut,
  Building2,
  GraduationCap,
  ClipboardList,
  Award,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">SMK Enscho Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem
            href="/admin/ppdb"
            icon={ClipboardList}
            label="PPDB / Pendaftaran"
          />
          <NavItem
            href="/admin/config"
            icon={Settings}
            label="Konfigurasi Sekolah"
          />
          <NavItem
            href="/admin/pages"
            icon={FileText}
            label="Halaman (Visi Misi)"
          />
          <NavItem href="/admin/features" icon={Award} label="Keunggulan" />
          <NavItem href="/admin/jurusan" icon={BookOpen} label="Jurusan" />
          <NavItem
            href="/admin/akademik"
            icon={GraduationCap}
            label="Akademik"
          />
          <NavItem
            href="/admin/posts"
            icon={FileText}
            label="Berita & Artikel"
          />
          <NavItem
            href="/admin/mitra"
            icon={Building2}
            label="Mitra Industri"
          />
          <NavItem href="/admin/documents" icon={FileText} label="Dokumen" />
          <NavItem href="/admin/gallery" icon={ImageIcon} label="Galeri" />
          <NavItem href="/admin/users" icon={Users} label="Pengguna" />
          <NavItem
            href="/admin/employees"
            icon={GraduationCap}
            label="Guru & Staf"
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-800 w-full rounded-md transition-colors">
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}
