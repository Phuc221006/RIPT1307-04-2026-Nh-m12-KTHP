import { Response, NextFunction } from "express";
import ApplicationStatusService from "../services/application_status_service.js";
import { AuthenticatedRequest } from "../middlewares/auth_middleware.js";

class ApplicationStatusController {
  async updateStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const applicationId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const { status, note } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Yêu cầu đăng nhập trước khi cập nhật trạng thái.",
        });
        return;
      }

      const result = await ApplicationStatusService.changeStatus(
        applicationId,
        userId,
        status,
        note,
      );

      const emailMessage = result.emailResult.success
        ? "Email thông báo đã được gửi thành công."
        : `Không gửi được email thông báo: ${result.emailResult.error || "Không xác định."}`;

      res.status(200).json({
        status: "success",
        message: `Cập nhật trạng thái hồ sơ thành công. ${emailMessage}`,
        data: {
          application: result.application,
          emailResult: result.emailResult,
        },
      });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
}

export default new ApplicationStatusController();
