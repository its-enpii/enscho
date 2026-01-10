import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ConfirmDialogProvider } from "@/components/ui/ConfirmDialog";
import { Role } from "@prisma/client";
import { getSchoolConfig } from "@/services/school";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const adminSession = cookieStore.get("admin_session")?.value;

  let userRole: Role = "ADMIN";
  let userName: string | null = "Administrator";

  if (session) {
    const [userId, role] = session.split(":");
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, role: true, image: true },
    });
    if (user) {
      userRole = user.role;
      userName = user.name;
    }
  } else if (!adminSession) {
    redirect("/admin/login");
  }

  const schoolConfig = await getSchoolConfig();

  // Fetch 5 recent posts for notifications
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      category: true,
      createdAt: true,
      slug: true,
    },
  });

  return (
    <ToastProvider>
      <ConfirmDialogProvider>
        <DashboardShell
          user={{ name: userName, email: "", role: userRole }}
          schoolName="SMK Enscho"
          logoUrl={schoolConfig.logoUrl}
          recentPosts={recentPosts}
        >
          {children}
        </DashboardShell>
      </ConfirmDialogProvider>
    </ToastProvider>
  );
}
