import { Response, NextFunction } from "express";
import ApplicationService from "../services/application_services.js";
import { AuthenticatedRequest } from "../middlewares/auth_middleware.js";

class ApplicationController {
  // Code của Trường: Dùng arrow function cho hàm create
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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
  }; // Đóng ngoặc chuẩn theo code của Trường

  // Code của Kiên: Thêm luồng lấy danh sách hồ sơ
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
}

export default new ApplicationController();
