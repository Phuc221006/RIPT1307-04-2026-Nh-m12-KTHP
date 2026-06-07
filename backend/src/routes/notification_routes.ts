import { Router } from "express";
import NotificationController from "../controllers/notification_controller.js";
import { authenticate } from "../middlewares/auth_middleware.js";

const router = Router();

router.use(authenticate);

// GET /api/notifications?role=student|admin
router.get("/", NotificationController.getNotifications);

// PUT /api/notifications/read-all
router.put("/read-all", NotificationController.markAllAsRead);

// PUT /api/notifications/:id/read
router.put("/:id/read", NotificationController.markAsRead);

export default router;
