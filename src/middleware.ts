import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const adminSession = request.cookies.get("admin_session")?.value;

  const { pathname } = request.nextUrl;

  // 1. Handle Admin Routes (legacy admin_session support + new session support)
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // Role-based access for /admin paths
    const userRole = session?.split(":")[1];
    const isAdmin = adminSession || userRole === "ADMIN";

    const isTeacher = userRole === "TEACHER";
    const isAlumni = userRole === "ALUMNI";
    const isStudent = userRole === "STUDENT";

    if (isLoginPage && isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isLoginPage) return NextResponse.next();

    // Define allowed paths for non-admins
    const teacherPaths = [
      "/admin/posts",
      "/admin/pages",
      "/admin/jurusan",
      "/admin/gallery",
    ];
    const alumniPaths = ["/admin/posts", "/admin/pages"];
    const studentPaths = ["/admin/gallery"];

    const isPathAllowed = (paths: string[]) =>
      paths.some((p) => pathname.startsWith(p));

    if (isAdmin) return NextResponse.next();

    if (isTeacher && isPathAllowed(teacherPaths)) return NextResponse.next();
    if (isAlumni && isPathAllowed(alumniPaths)) return NextResponse.next();
    if (isStudent && isPathAllowed(studentPaths)) return NextResponse.next();

    // If not allowed, redirect to login if not authenticated or to home if unauthorized
    if (!session && !adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Default: Redirect back to their respective portal if they try to access unauthorized /admin area
    if (isTeacher) return NextResponse.redirect(new URL("/guru", request.url));
    if (isAlumni) return NextResponse.redirect(new URL("/alumni", request.url));
    if (isStudent) return NextResponse.redirect(new URL("/siswa", request.url));

    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Handle Other Role Portals
  const rolePortals = [
    { path: "/guru", role: "TEACHER" },
    { path: "/siswa", role: "STUDENT" },
    { path: "/alumni", role: "ALUMNI" },
  ];

  for (const portal of rolePortals) {
    if (pathname.startsWith(portal.path)) {
      if (!session) {
        const loginPath = `/login/${portal.path.substring(1)}`;
        return NextResponse.redirect(new URL(loginPath, request.url));
      }

      const [userId, userRole] = session.split(":");

      // Allow user if they have the specific role OR they are an ADMIN
      if (userRole !== portal.role && userRole !== "ADMIN") {
        // Redirect to their own portal or home if unauthorized
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/guru/:path*", "/siswa/:path*", "/alumni/:path*"],
};
