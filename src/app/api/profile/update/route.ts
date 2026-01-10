import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { deleteFile } from "@/lib/file-upload";
import { saveFile } from "@/lib/upload";
import path from "path";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userId] = session.split(":");
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const imageFile = formData.get("image") as File;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
    };

    // Handle Image Upload
    if (imageFile && imageFile.name) {
      try {
        const savedPath = await saveFile(imageFile, "profiles");

        if (savedPath) {
          updateData.image = savedPath;

          // Delete old image if exists
          if (user.image) {
            await deleteFile(user.image);
          }
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        return NextResponse.json(
          { error: "Gagal mengupload foto profil" },
          { status: 500 }
        );
      }
    }

    // If changing password
    if (currentPassword && newPassword) {
      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Password lama tidak sesuai" },
          { status: 400 }
        );
      }

      // Check if new passwords match
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "Password baru tidak cocok" },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
