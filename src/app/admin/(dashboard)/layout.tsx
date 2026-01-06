import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ConfirmDialogProvider } from "@/components/ui/ConfirmDialog";
import { Role } from "@prisma/client";

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
      select: { name: true, role: true },
    });
    if (user) {
      userRole = user.role;
      userName = user.name;
    }
  } else if (!adminSession) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <ConfirmDialogProvider>
        <DashboardShell
          user={{ name: userName, email: "", role: userRole }}
          schoolName="SMK Enscho"
        >
          {children}
        </DashboardShell>
      </ConfirmDialogProvider>
    </ToastProvider>
  );
}
