import path from "path";

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export function getContentTypeByFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

export function buildInlineContentDisposition(filename: string): string {
  const safeName = path.basename(filename).replace(/[^\w.\-() ]/g, "_");
  return `inline; filename="${safeName}"`;
}

export function isSafeFilename(filename: string): boolean {
  if (!filename) return false;
  if (filename.includes("..")) return false;
  if (filename.includes("/") || filename.includes("\\")) return false;
  return true;
}

/** Chỉ cho phép proxy URL Cloudinary công khai — chống SSRF */
export function isAllowedPreviewUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "res.cloudinary.com"
    );
  } catch {
    return false;
  }
}
