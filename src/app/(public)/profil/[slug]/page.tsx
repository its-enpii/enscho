import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page) {
    notFound();
  }

  // Generate breadcrumbs based on page title
  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Profil Sekolah", href: "/profil" },
    { label: page.title, href: `/profil/${slug}` },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-blue-900 text-white py-16 relative overflow-hidden border-b border-white/10">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>

          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-blue-200 overflow-x-auto whitespace-nowrap pb-1">
            <Link href="/" className="hover:text-white transition-colors">
              <Home size={14} />
            </Link>
            {breadcrumbs.slice(1).map((item, index) => (
              <div key={item.href} className="flex items-center gap-2">
                <ChevronRight size={12} />
                <Link
                  href={item.href}
                  className={`${
                    index === breadcrumbs.length - 2
                      ? "text-white font-medium pointer-events-none"
                      : "hover:text-white transition-colors"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          <article
            className="prose prose-slate max-w-none prose-lg prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
}
