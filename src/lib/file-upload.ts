import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function saveFile(file: File, folder: string = "uploads"): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`; 
    
    // Ensure public/uploads/{folder} exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    
    try {
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);
        return `/uploads/${folder}/${filename}`;
    } catch (e) {
        console.error("Error saving file:", e);
        return null;
    }
}
