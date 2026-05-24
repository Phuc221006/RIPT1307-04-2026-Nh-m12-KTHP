import { Router } from "express";
import UploadController from "../controllers/upload_controller.js";
import { upload } from "../middlewares/upload_middleware.js";
import { authenticate } from "../middlewares/auth_middleware.js";

const router = Router();

// Endpoint upload file, yêu cầu đăng nhập và key field gửi lên là 'file'
router.post(
  "/documents",
  authenticate,
  upload.single("file"),
  UploadController.uploadFile,
);

export default router;
