import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export async function saveFile(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${folder}/${fileName}`;
}
