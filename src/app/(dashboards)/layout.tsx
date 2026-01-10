import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSchoolConfig } from "@/services/school";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ConfirmDialogProvider } from "@/components/ui/ConfirmDialog";

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
    select: { name: true, email: true, role: true, image: true },
  });

  if (!user) {
    cookieStore.delete("session");
    redirect("/");
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
          user={{ ...user, image: user.image }}
          schoolName={schoolConfig.name}
          logoUrl={schoolConfig.logoUrl}
          recentPosts={recentPosts}
        >
          {children}
        </DashboardShell>
      </ConfirmDialogProvider>
    </ToastProvider>
  );
}
