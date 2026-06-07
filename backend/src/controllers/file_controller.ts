import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import {
  buildInlineContentDisposition,
  getContentTypeByFilename,
  isAllowedPreviewUrl,
  isSafeFilename,
} from "../utils/fileHeaders.js";

const DOCUMENTS_DIR = path.join(process.cwd(), "uploads", "documents");

class FileController {
  /** Phục vụ file minh chứng cục bộ (legacy) với header inline để xem trên trình duyệt */
  viewDocument = (req: Request, res: Response): void => {
    const filename = Array.isArray(req.params.filename)
      ? req.params.filename[0]
      : req.params.filename;

    if (!isSafeFilename(filename)) {
      res.status(400).json({
        status: "error",
        message: "Tên file không hợp lệ.",
      });
      return;
    }

    const filePath = path.join(DOCUMENTS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        status: "error",
        message: "Không tìm thấy file minh chứng.",
      });
      return;
    }

    const contentType = getContentTypeByFilename(filename);

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      buildInlineContentDisposition(filename),
    );
    res.sendFile(filePath);
  };

  /**
   * Proxy file từ Cloudinary và ghi đè header inline.
   * Giải quyết trường hợp /raw/upload/ khiến trình duyệt auto-download.
   * GET /api/v1/files/preview?url=...&name=...
   */
  previewRemote = async (req: Request, res: Response): Promise<void> => {
    const fileUrl = typeof req.query.url === "string" ? req.query.url : "";
    const fileName =
      typeof req.query.name === "string" ? req.query.name : "document";

    if (!fileUrl || !isAllowedPreviewUrl(fileUrl)) {
      res.status(400).json({
        status: "error",
        message: "URL file không hợp lệ.",
      });
      return;
    }

    try {
      let upstream;
      try {
        // Thêm Headers để Cloudinary hiểu đây là request từ trình duyệt/server uy tín
        upstream = await fetch(fileUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
      } catch (fetchError: any) {
        console.error(`Fetch exception for URL ${fileUrl}:`, fetchError);
        res.status(502).json({
          status: "error",
          message: "Lỗi kết nối tới Cloudinary: " + fetchError.message,
        });
        return;
      }

      if (!upstream.ok || !upstream.body) {
        console.error(`Fetch failed for URL: ${fileUrl}`);
        console.error(`Status: ${upstream.status} ${upstream.statusText}`);
        res.status(502).json({
          status: "error",
          message: `Không thể lấy file từ Cloudinary. Status: ${upstream.status}`,
        });
        return;
      }

      let finalFileName = fileName;
      if (!path.extname(finalFileName)) {
        try {
          const urlExt = path.extname(new URL(fileUrl).pathname);
          if (urlExt) {
            finalFileName += urlExt;
          }
        } catch (e) {
          // Bỏ qua nếu parse URL lỗi
        }
      }

      let contentType = upstream.headers.get("content-type") || "";
      if (!contentType || contentType.includes("octet-stream")) {
        contentType = getContentTypeByFilename(finalFileName);
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        buildInlineContentDisposition(finalFileName),
      );

      const nodeStream = Readable.fromWeb(
        upstream.body as import("stream/web").ReadableStream,
      );
      await pipeline(nodeStream, res);
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({
          status: "error",
          message: "Lỗi khi phục vụ file xem trước.",
        });
      }
    }
  };
}

export default new FileController();
