import multer from "multer";
import path from "path";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";

const uploadDir = path.join(process.cwd(), "uploads", "documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
]);

function isAllowedUpload(file: Express.Multer.File): boolean {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) return false;

  if (ALLOWED_MIME_TYPES.has(file.mimetype)) return true;

  // Windows đôi khi gửi octet-stream hoặc mimetype rỗng — tin extension hợp lệ
  if (!file.mimetype || file.mimetype === "application/octet-stream") {
    return true;
  }

  return false;
}

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (isAllowedUpload(file)) {
    cb(null, true);
    return;
  }
  cb(new Error("Chỉ cho phép tải lên file PDF hoặc Ảnh (JPG, PNG)."));
};

export const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  },
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1) || "bin";
    const isPdf = file.mimetype === "application/pdf" || ext === "pdf";

    return {
      folder: "htqlts/documents",
      resource_type: "auto",
      type: "upload",
      format: isPdf
        ? "pdf"
        : ext === "jpg" || ext === "jpeg"
          ? "jpg"
          : ext === "png"
            ? "png"
            : undefined,
      public_id: `doc-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

const storage = hasCloudinaryConfig ? cloudinaryStorage : diskStorage;

if (!hasCloudinaryConfig) {
  console.warn(
    "⚠️ [Upload] Chưa cấu hình Cloudinary — dùng lưu trữ cục bộ tại uploads/documents",
  );
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});
