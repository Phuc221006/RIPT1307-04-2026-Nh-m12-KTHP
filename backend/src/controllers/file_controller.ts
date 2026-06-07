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
      const upstream = await fetch(fileUrl);

      if (!upstream.ok || !upstream.body) {
        res.status(502).json({
          status: "error",
          message: "Không thể lấy file từ Cloudinary.",
        });
        return;
      }

      const contentType = getContentTypeByFilename(fileName);

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        buildInlineContentDisposition(fileName),
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
