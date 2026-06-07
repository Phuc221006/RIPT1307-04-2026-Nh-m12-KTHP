import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error("Chỉ cho phép tải lên file PDF hoặc Ảnh (JPG, PNG)."));
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const ext = file.originalname.split(".").pop()?.toLowerCase() || "bin";
    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: "htqlts/documents",
      resource_type: "auto",
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

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});
