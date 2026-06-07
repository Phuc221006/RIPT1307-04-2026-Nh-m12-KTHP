import { Router } from "express";
import NotificationController from "../controllers/notification_controller.js";

const router = Router();

// GET /api/notifications?role=student|admin
router.get("/", NotificationController.getNotifications);

// PUT /api/notifications/:id/read
router.put("/:id/read", NotificationController.markAsRead);

export default router;
