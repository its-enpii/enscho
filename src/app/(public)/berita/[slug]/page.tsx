import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Cast to any to duplicate the "fix" pattern for potential TS editor issues, 
  // though Post model usually doesn't have the new fields issue. 
  // But safer to just be standard unless errors pop up.
  // Actually, standard fetch first.
  const post = await prisma.post.findUnique({
    where: { slug }
  });

  if (!post || !post.published) {
    notFound();
  }

  // Get related posts (simple implementation: same category, different id)
  const relatedPosts = await prisma.post.findMany({
    where: {
      category: post.category,
      id: { not: post.id },
      published: true
    },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header / Hero */}
      <div className="bg-white border-b border-slate-200">
         <div className="container mx-auto px-4 py-8">
            <Link href="/berita" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors text-sm font-medium">
               <ArrowLeft size={16} className="mr-2" /> Kembali ke Berita
            </Link>
            
            <div className="max-w-4xl mx-auto">
               <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} className="text-blue-500"/> {post.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1 capitalize px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium text-xs">
                    <Tag size={12} /> {post.category}
                  </span>
               </div>
               
               <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-8">
                 {post.title}
               </h1>

               {post.imageUrl && (
                 <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg mb-10">
                    <Image 
                      src={post.imageUrl} 
                      alt={post.title} 
                      fill 
                      className="object-cover"
                      priority
                    />
                 </div>
               )}
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
           {/* Main Content */}
           <div className="lg:col-span-2">
              <article className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
                 <div 
                    className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                 />
              </article>
           </div>

           {/* Sidebar / Related */}
           <div>
              <div className="sticky top-24 space-y-8">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-6 border-b pb-2">Berita Terkait</h3>
                    <div className="space-y-6">
                       {relatedPosts.length > 0 ? (
                         relatedPosts.map((related) => (
                           <Link key={related.id} href={`/berita/${related.slug}`} className="group block">
                              <div className="relative h-32 mb-3 rounded-lg overflow-hidden bg-slate-100">
                                 {related.imageUrl && (
                                   <Image src={related.imageUrl} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                 )}
                              </div>
                              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                {related.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-2">
                                {related.createdAt.toLocaleDateString('id-ID')}
                              </p>
                           </Link>
                         ))
                       ) : (
                         <p className="text-sm text-slate-500">Tidak ada berita terkait lainnya.</p>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
