import { Request, Response } from "express";
import { hasCloudinaryConfig } from "../middlewares/upload_middleware.js";

type CloudinaryMulterFile = Express.Multer.File & {
  path?: string;
  secure_url?: string;
  url?: string;
};

class UploadController {
  uploadFile = (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message:
            "Không tìm thấy file tải lên. Đảm bảo key form-data là 'file'.",
        });
      }

      const file = req.file as CloudinaryMulterFile;
      let fileUrl: string | undefined;

      if (hasCloudinaryConfig) {
        fileUrl = file.path || file.secure_url || file.url;
        if (!fileUrl) {
          return res.status(500).json({
            status: "error",
            message:
              "Upload thành công nhưng không nhận được URL từ Cloudinary.",
          });
        }
      } else {
        fileUrl = `/uploads/documents/${file.filename}`;
      }

      return res.status(200).json({
        status: "success",
        message: hasCloudinaryConfig
          ? "Tải file lên Cloudinary thành công"
          : "Tải file lên thành công",
        data: {
          originalName: file.originalname,
          fileUrl,
          mimeType: file.mimetype,
          fileSize: file.size,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: "Lỗi hệ thống khi xử lý file: " + error.message,
      });
    }
  };
}

export default new UploadController();
