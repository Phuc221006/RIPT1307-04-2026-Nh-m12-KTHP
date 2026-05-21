import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Mở rộng interface Request mặc định của Express để nhét thêm thông tin user vào
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "ADMIN" | "CANDIDATE";
  };
}

/**
 * 1. Middleware Xác thực (Authentication)
 * Kiểm tra xem người dùng đã đăng nhập và có gửi kèm Token hợp lệ không.
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  // Lấy chuỗi token từ header (định dạng: "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      message: "Vui lòng đăng nhập để thực hiện thao tác này.",
    });
    return;
  }

  // Cắt bỏ chữ "Bearer " để lấy đúng đoạn mã Token
  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET || "fallback_secret_key";

  try {
    // Giải mã token. Nếu token sai hoặc hết hạn, hàm verify sẽ văng lỗi (throw error) xuống catch
    const decoded = jwt.verify(token, secretKey) as any;

    // Nếu hợp lệ, ghim thông tin user vào request để Controller phía sau sử dụng
    req.user = decoded;

    // Mở cửa cho đi tiếp vào Controller
    next();
  } catch (error) {
    res.status(403).json({
      status: "error",
      message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
    });
    return;
  }
};

/**
 * 2. Middleware Phân quyền (Authorization - Role-based Access Control)
 * Kiểm tra xem người dùng có quyền (Role) phù hợp để thực hiện tính năng này không.
 * Lưu ý: Luôn phải chạy middleware 'authenticate' trước để lấy req.user rồi mới chạy hàm này.
 */
export const authorize = (...allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    // Nếu chưa đăng nhập hoặc Role không nằm trong danh sách được phép -> Chặn lại
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: "error",
        message: "Bạn không có quyền truy cập vào chức năng này.",
      });
      return;
    }

    // Hợp lệ -> Cho đi tiếp
    next();
  };
};
