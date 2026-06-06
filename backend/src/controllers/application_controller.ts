import { Response, NextFunction } from "express";
import ApplicationService from "../services/application_services.js";
import { AuthenticatedRequest } from "../middlewares/auth_middleware.js";

class ApplicationController {
  // Luồng nộp hồ sơ
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Lấy ID của thí sinh từ Token (đã được middleware authenticate nhúng vào)
      const userId = req.user!.id;

      const result = await ApplicationService.submitApplication(
        userId,
        req.body,
      );

      res.status(201).json({
        status: "success",
        message: "Nộp hồ sơ xét tuyển thành công.",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  // Luồng lấy danh sách hồ sơ của thí sinh
  async getMyApplications(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      // Gọi qua Service để lấy dữ liệu từ Database
      const result = await ApplicationService.getMyApplications(userId);

      res.status(200).json({
        status: "success",
        message: "Lấy danh sách hồ sơ thành công.",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async getStats(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      // Lấy userId từ middleware authenticate nhúng vào
      const userId = req.user!.id;

      // Gọi sang Service đếm số lượng hồ sơ
      const stats = await ApplicationService.getDashboardStats(userId);

      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message || "Lỗi khi lấy số liệu thống kê.",
      });
    }
  }
}

export default new ApplicationController();
