import { Router } from "express";
import ApplicationController from "../controllers/application_controller.js";
import { updateStatus } from "../controllers/status_controller.js";
import { authenticate, authorize } from "../middlewares/auth_middleware.js";

const router = Router();

// API tạo hồ sơ (Yêu cầu đăng nhập)
router.post("/", authenticate, ApplicationController.create);

// API của Kiên: Mở cửa cho Frontend lấy lịch sử hồ sơ
router.get("/me", authenticate, ApplicationController.getMyApplications);

// 🔹 THÊM DÒNG NÀY: API lấy số liệu 4 ô thống kê Dashboard cho Kiên
router.get("/stats", authenticate, ApplicationController.getStats);

// API của Trường: Admin duyệt/cập nhật trạng thái hồ sơ
router.patch("/:id/status", authenticate, authorize("ADMIN"), updateStatus);

export default router;
