import { Router } from "express";
import UploadController from "../controllers/upload_controller.js";
import { upload } from "../middlewares/upload_middleware.js";
import { authenticate } from "../middlewares/auth_middleware.js";

const router = Router();

// Endpoint upload file, yêu cầu đăng nhập và key field gửi lên là 'file'
router.post(
  "/documents",
  authenticate,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("[Upload] Multer error:", err);
        const message =
          err.code === "LIMIT_FILE_SIZE"
            ? "File vượt quá dung lượng cho phép (5MB)."
            : err.message || "Không thể upload file.";
        return res.status(400).json({
          status: "error",
          message,
        });
      }
      next();
    });
  },
  UploadController.uploadFile,
);

export default router;
