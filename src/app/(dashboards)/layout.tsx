import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSchoolConfig } from "@/services/school";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/");
  }

  const [userId] = session.split(":");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  if (!user) {
    cookieStore.delete("session");
    redirect("/");
  }

  const schoolConfig = await getSchoolConfig();

  return (
    <DashboardShell user={user} schoolName={schoolConfig.name}>
      {children}
    </DashboardShell>
  );
}
