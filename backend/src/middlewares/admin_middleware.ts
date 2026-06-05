import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth_middleware.js";

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ status: "error", message: "Không có quyền truy cập." });
    return;
  }
  next();
}