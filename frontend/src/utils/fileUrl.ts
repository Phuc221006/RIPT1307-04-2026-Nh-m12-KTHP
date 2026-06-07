const API_ORIGIN = (
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1"
).replace(/\/api\/v1\/?$/, "");

export function isPdfFile(name?: string, url?: string): boolean {
  if (name?.toLowerCase().endsWith(".pdf")) return true;
  if (url?.toLowerCase().includes(".pdf")) return true;
  return false;
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
