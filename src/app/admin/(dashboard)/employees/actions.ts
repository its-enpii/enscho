"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const employeeSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  position: z.string().optional(),
  category: z.enum(["GURU", "STAF", "KEPSEK"]),
  imageUrl: z.string().optional(),
  order: z.coerce.number().default(0),
});

async function saveFile(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`; // Unique filename
    
    // Save to public/uploads/employees
    // Note: In production (Vercel), this won't persist. Need S3/Cloudinary.
    // For local Windows dev, this works fine.
    const uploadDir = path.join(process.cwd(), "public/uploads/employees");
    const filePath = path.join(uploadDir, filename);

    try {
        await writeFile(filePath, buffer);
        return `/uploads/employees/${filename}`;
    } catch (e) {
        console.error("Error saving file:", e);
        return null;
    }
}

export async function createEmployee(formData: FormData) {
  const imageFile = formData.get("imageFile") as File;
  let imageUrl = formData.get("imageUrl") as string;

  // Process file upload if exists
  if (imageFile && imageFile.size > 0) {
      const savedPath = await saveFile(imageFile);
      if (savedPath) imageUrl = savedPath;
  }

  const data = {
    name: formData.get("name"),
    position: formData.get("position"),
    category: formData.get("category"),
    imageUrl: imageUrl, // Use the processed URL
    order: formData.get("order"),
  };

  const parsed = employeeSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  await prisma.employee.create({
    data: {
        name: parsed.data.name,
        position: parsed.data.position,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl,
        order: parsed.data.order
    }
  });

  revalidatePath("/admin/employees");
  revalidatePath("/profil/guru");
  redirect("/admin/employees");
}

export async function updateEmployee(id: string, formData: FormData) {
    const imageFile = formData.get("imageFile") as File;
    let imageUrl = formData.get("imageUrl") as string;

    // Process file upload if exists
    if (imageFile && imageFile.size > 0) {
        const savedPath = await saveFile(imageFile);
        if (savedPath) imageUrl = savedPath;
    }

    const data = {
      name: formData.get("name"),
      position: formData.get("position"),
      category: formData.get("category"),
      imageUrl: imageUrl, 
      order: formData.get("order"),
    };
  
    const parsed = employeeSchema.safeParse(data);
  
    if (!parsed.success) {
      return { error: parsed.error.message };
    }
  
    await prisma.employee.update({
      where: { id },
      data: {
          name: parsed.data.name,
          position: parsed.data.position,
          category: parsed.data.category,
          imageUrl: parsed.data.imageUrl,
          order: parsed.data.order
      }
    });
  
    revalidatePath("/admin/employees");
    revalidatePath("/profil/guru");
    redirect("/admin/employees");
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.employee.delete({ where: { id } });
    revalidatePath("/admin/employees");
    revalidatePath("/profil/guru");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus data" };
  }
}
