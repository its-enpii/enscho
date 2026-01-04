"use client";

import Link from "next/link";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import clsx from "clsx";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  category: string;
}

export function NewsGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  // Helper to format date
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
               <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Berita & Artikel</span>
               <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">Berita Terkini</h2>
            </div>
            <Link href="/berita" className="hidden md:inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors group">
               Lihat Semua <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>

         {/* Layout: Standard Grid (3 Columns) for balanced size */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
               <article key={post.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <Link href={`/berita/${post.slug}`} className="block relative aspect-video overflow-hidden">
                     {post.imageUrl ? (
                        <img 
                           src={post.imageUrl} 
                           alt={post.title} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                     ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">No Image</div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     
                     <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-sm">
                           {post.category}
                        </span>
                     </div>
                  </Link>

                  <div className="flex-1 p-5 flex flex-col">
                     <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                        <Calendar size={14} className="text-blue-500" />
                        <span>{formatDate(post.createdAt)}</span>
                     </div>

                     <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                        <Link href={`/berita/${post.slug}`}>
                           {post.title}
                        </Link>
                     </h3>
                     
                     {post.excerpt && (
                        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                           {post.excerpt}
                        </p>
                     )}

                     <Link href={`/berita/${post.slug}`} className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold mt-auto group/btn">
                        Baca Selengkapnya <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                     </Link>
                  </div>
               </article>
            ))}
         </div>
         
         <div className="mt-8 text-center md:hidden">
            <Link href="/berita" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm">
               Lihat Semua Berita <ArrowRight size={16} />
            </Link>
         </div>
      </div>
    </section>
  );
}
