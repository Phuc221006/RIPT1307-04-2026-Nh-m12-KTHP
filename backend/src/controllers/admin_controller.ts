import { Request, Response, NextFunction } from "express";
import AdminService from "../services/admin_services.js";

class AdminController {
  async getStatistics(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await AdminService.getStatistics();
      res.status(200).json({ status: "success", data });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async getAllApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await AdminService.getAllApplications(req.query);
      res.status(200).json({ status: "success", data });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // 🚀 THÊM 'as string' VÀO ĐÂY ĐỂ ÉP KIỂU
      const data = await AdminService.updateApplicationStatus(
        id as string,
        status,
      );

      res.status(200).json({ status: "success", data });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
  async getUniversities(req: Request, res: Response) {
    try {
      const data = await AdminService.getUniversities();

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getMajors(req: Request, res: Response) {
    try {
      const data = await AdminService.getMajors();

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  // SỬA Ở ĐÂY: Đã xóa chữ "static" để đồng bộ với các hàm khác
  async getEmailLogs(req: Request, res: Response, next: NextFunction) {
    try {
      // Viết logic lấy dữ liệu log email từ DB ở đây
      // Ví dụ: const logs = await EmailLogModel.find();
      res.status(200).json({ status: "success", data: [] });
    } catch (error) {
      next(error);
    }
  }

  async getCombinations(req: Request, res: Response) {
    try {
      const data = await AdminService.getCombinations();

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new AdminController();
