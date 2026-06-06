import { Router } from "express";
import AdminController from "../controllers/admin_controller.js";
import { authenticate } from "../middlewares/auth_middleware.js";
import { requireAdmin } from "../middlewares/admin_middleware.js";

const router = Router();

// Các route này sẽ tương ứng với đường dẫn: /api/v1/admin/
router.get(
  "/statistics",
  authenticate,
  requireAdmin,
  AdminController.getStatistics,
);

// Route này khớp với fetch(`${API_BASE}/admin/applications`, ...) ở FE
router.get(
  "/applications",
  authenticate,
  requireAdmin,
  AdminController.getAllApplications,
);

// Route này khớp với patch `${API_BASE}/applications/${id}/status`
router.patch(
  "/applications/:id/status",
  authenticate,
  requireAdmin,
  AdminController.updateStatus,
);

// Route này khớp với fetch(`${API_BASE}/admin/email-logs`, ...) ở FE
// Nếu AdminController chưa có hàm getEmailLogs, ông cần bổ sung trong Controller
router.get(
  "/email-logs",
  authenticate,
  requireAdmin,
  AdminController.getEmailLogs,
);

export default router;
