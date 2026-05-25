"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UploadController {
    async uploadFile(req, res) {
        try {
            if (!req.file) {
                res
                    .status(400)
                    .json({ status: "error", message: "Không tìm thấy tệp tin." });
                return;
            }
            res.status(200).json({
                status: "success",
                message: "Tải tệp tin lên thành công.",
                data: {
                    originalName: req.file.originalname,
                    fileUrl: `/uploads/documents/${req.file.filename}`,
                    mimeType: req.file.mimetype,
                    fileSize: req.file.size,
                },
            });
        }
        catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
}
exports.default = new UploadController();
