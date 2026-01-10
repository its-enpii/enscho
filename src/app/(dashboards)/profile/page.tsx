import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/app/admin/(dashboard)/profile/_components/ProfileForm";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/");
  }

  const [userId] = session.split(":");

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Profil</h1>
        <p className="text-slate-600 mt-1">
          Kelola informasi profil dan keamanan akun Anda
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <ProfileForm user={user} isAdmin={false} />
      </div>
    </div>
  );
}
