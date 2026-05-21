import multer from "multer";
import path from "path";
import fs from "fs";

// Tự động tạo thư mục nếu chưa tồn tại
const uploadDir = "uploads/documents";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Đổi tên file: Thời gian hiện tại + chuỗi ngẫu nhiên + đuôi file gốc
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Giới hạn file 5MB
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
