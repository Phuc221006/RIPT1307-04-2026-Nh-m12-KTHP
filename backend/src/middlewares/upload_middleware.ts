import multer from "multer";
import path from "path";
import fs from "fs";

// Đảm bảo thư mục lưu trữ tồn tại, nếu chưa có thì tự động tạo
const uploadDir = path.join(process.cwd(), "uploads/documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Lưu vào folder backend/uploads/documents/
  },
  filename: function (req, file, cb) {
    // Đổi tên file để không bị trùng (Thêm timestamp vào trước tên gốc)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

// Chặn không cho upload file bậy bạ (Chỉ nhận PDF, JPG, PNG, JPEG)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép tải lên file PDF hoặc Ảnh (JPG, PNG)."), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn file tối đa 5MB
  },
  fileFilter: fileFilter,
});
