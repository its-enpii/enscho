import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProfilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const page = await prisma.page.findUnique({
    where: { slug }
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b pb-4">{page.title}</h1>
        <article 
          className="prose prose-slate max-w-none prose-lg"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
