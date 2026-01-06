"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const targetRole = formData.get("targetRole") as Role;
  const rememberMe = formData.get("remember-me") === "on";

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email atau password salah" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Fallback for plain text (for existing users during migration)
      if (user.password !== password) {
        return { error: "Email atau password salah" };
      }
    }

    // Role validation
    // ADMIN can access anything? Or strictly matching?
    // Usually portals only allow specific roles.
    if (user.role !== targetRole && user.role !== "ADMIN") {
      return {
        error: `Akses ditolak. Akun Anda bukan merupakan ${targetRole.toLowerCase()}.`,
      };
    }

    // Set session cookie
    const cookieStore = await cookies();
    // In a real app, this should be an encrypted JWT
    cookieStore.set("session", `${user.id}:${user.role}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      path: "/",
    });

    // Special case for admin login page which might want to use the same action
    if (targetRole === "ADMIN") {
      cookieStore.set("admin_session", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
        path: "/",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan pada server" };
  }

  // Redirect based on targetRole
  redirect("/" + targetRole.toLowerCase());
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("admin_session");
  redirect("/");
}
