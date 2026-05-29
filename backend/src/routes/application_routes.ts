import { Router } from "express";
import ApplicationController from "../controllers/application_controller.js";
import { authenticate } from "../middlewares/auth_middleware.js";

const router = Router();

// Phải đăng nhập mới được nộp hồ sơ
router.post("/", authenticate, ApplicationController.create);

// THÊM DÒNG NÀY: Mở cửa cho Frontend lấy lịch sử hồ sơ
router.get("/me", authenticate, ApplicationController.getMyApplications);

export default router;
