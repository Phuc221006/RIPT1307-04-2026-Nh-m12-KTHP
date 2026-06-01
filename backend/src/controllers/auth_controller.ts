import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth_services.js";

class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await AuthService.registerUser(req.body);

      res.status(201).json({
        status: "success",
        message: "Đăng ký tài khoản thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.loginUser(req.body);

      res.status(200).json({
        status: "success",
        message: "Đăng nhập thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new AuthController();
