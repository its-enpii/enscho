"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  if (!email || !password) {
    return { error: "Email dan password harus diisi" };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { error: "Email sudah terdaftar" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
      role: role as any,
    },
  });

  revalidatePath("/admin/users");
  // redirect("/admin/users");
  return { success: true };
}

export async function updateUser(id: string, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return { error: "Pengguna tidak ditemukan" };
  }

  if (email !== user.email) {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { error: "Email sudah digunakan oleh pengguna lain" };
    }
  }

  const updateData: any = {
    email,
    name: name || null,
    role: role as any,
  };

  if (password && password.trim() !== "") {
    updateData.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/users");
  // redirect("/admin/users");
  return { success: true };
}
