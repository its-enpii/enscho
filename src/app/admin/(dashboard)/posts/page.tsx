import { prisma } from "@/lib/prisma";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { DeleteButton } from "../../components/DeleteButton";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } }
  });

  async function deletePost(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Kelola Berita & Artikel</h1>
        <Link href="/admin/posts/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <Plus size={18} /> Tulis Berita
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm">Judul</th>
              <th className="px-6 py-4 font-semibold text-sm">Kategori</th>
              <th className="px-6 py-4 font-semibold text-sm">Status</th>
               <th className="px-6 py-4 font-semibold text-sm">Tanggal</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.length === 0 ? (
               <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Belum ada berita.</td>
               </tr>
            ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 line-clamp-1 max-w-xs">{post.title}</td>
                    <td className="px-6 py-4 text-slate-500 capitalize">{post.category}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {post.published ? 'Published' : 'Draft'}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-slate-500 text-sm">{post.createdAt.toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={18} />
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <DeleteButton />
                      </form>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
