import { Request, Response } from "express";

class UploadController {
  uploadFile = (req: Request, res: Response) => {
    try {
      // Multer đã xử lý lưu file và gắn thông tin vào req.file
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message:
            "Không tìm thấy file tải lên. Đảm bảo key form-data là 'file'.",
        });
      }

      // Tạo đường dẫn tĩnh để Frontend có thể hiển thị ảnh/PDF
      // Trả về dạng: /uploads/documents/doc-12345.pdf
      const fileUrl = `/uploads/documents/${req.file.filename}`;

      return res.status(200).json({
        status: "success",
        message: "Tải file thành công",
        data: {
          originalName: req.file.originalname,
          fileUrl: fileUrl,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
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
