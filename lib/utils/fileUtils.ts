import fs from "fs";
import path from "path";

export function readFileSafe(filePath: string): Buffer | null {
  try {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      console.error(`File not found: ${absolutePath}`);
      return null;
    }
    return fs.readFileSync(absolutePath);
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
}
