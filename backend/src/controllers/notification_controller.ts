import { Response } from "express";
import NotificationService from "../services/notification_services.js";
import { AuthenticatedRequest } from "../middlewares/auth_middleware.js";

class NotificationController {
  getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const notifications = await NotificationService.getUserNotifications(
        userId,
        userRole,
      );

      return res.status(200).json({
        status: "success",
        data: notifications,
        message: "Lấy danh sách thông báo thành công",
      });
    } catch (error: any) {
      console.error("Notification get error:", error);
      return res.status(500).json({
        status: "error",
        message: "Lỗi hệ thống khi lấy thông báo: " + error.message,
      });
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const notificationId = Array.isArray(id) ? id[0] : id;
      await NotificationService.markAsRead(notificationId, userId);

      return res.status(200).json({
        status: "success",
        message: "Đánh dấu đã đọc thành công",
      });
    } catch (error: any) {
      return res.status(400).json({
        status: "error",
        message: error.message || "Không thể đánh dấu đã đọc.",
      });
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      await NotificationService.markAllAsRead(userId);

      return res.status(200).json({
        status: "success",
        message: "Đánh dấu tất cả đã đọc thành công",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: "Lỗi hệ thống khi đánh dấu đã đọc: " + error.message,
      });
    }
  };
}

export default new NotificationController();
