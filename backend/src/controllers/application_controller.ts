import { Response, NextFunction } from "express";
import ApplicationService from "../services/application_services.js";
import { AuthenticatedRequest } from "../middlewares/auth_middleware.js";

class ApplicationController {
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
}

export default new ApplicationController();
