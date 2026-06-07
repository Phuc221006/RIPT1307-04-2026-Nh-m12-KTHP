const API_ORIGIN = (
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1"
).replace(/\/api\/v1\/?$/, "");

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1";

function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com");
}

export function isPdfFile(name?: string, url?: string): boolean {
  if (name?.toLowerCase().endsWith(".pdf")) return true;
  if (url?.toLowerCase().includes(".pdf")) return true;
  return false;
}

/**
 * Cloudinary /raw/upload/ không có đuôi .pdf trong URL nhưng vẫn force download.
 * Route qua backend proxy để ghi đè Content-Disposition: inline.
 */
function buildPreviewProxyUrl(remoteUrl: string, fileName?: string): string {
  const params = new URLSearchParams({ url: remoteUrl });
  if (fileName) params.set("name", fileName);
  return `${API_BASE}/files/preview?${params.toString()}`;
}

/**
 * Trả về URL có thể mở trực tiếp trên trình duyệt (inline, không auto-download).
 */
export function resolveFileUrl(
  url?: string | null,
  fileName?: string,
): string {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    if (isCloudinaryUrl(url)) {
      return buildPreviewProxyUrl(url, fileName);
    }
    return url;
  }

  if (url.startsWith("/")) return `${API_ORIGIN}${url}`;
  return `${API_ORIGIN}/${url}`;
}

export function getFileUrlFromRecord(file?: {
  fileUrl?: string;
  file_url?: string;
  url?: string;
  originalName?: string;
  original_name?: string;
  name?: string;
}): string {
  if (!file) return "";
  const rawUrl = file.fileUrl || file.file_url || file.url;
  const name =
    file.name || file.originalName || file.original_name || undefined;
  return resolveFileUrl(rawUrl, name);
}

/** URL dùng cho thẻ iframe/embed xem PDF */
export function resolvePdfViewerUrl(
  url?: string | null,
  fileName?: string,
): string {
  return resolveFileUrl(url, fileName);
}
