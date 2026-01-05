"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Fallback for plain text
      if (user.password !== password) {
        return { error: "Invalid email or password" };
      }
    }

    if (user.role !== "ADMIN") {
      return { error: "Access denied. Admin only." };
    }

    // Set simple session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    // Also set unified session cookie
    cookieStore.set("session", `${user.id}:${user.role}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong" };
  }

  redirect("/admin");
}
