import { Router } from "express";
import ApplicationController from "../controllers/application_controller.js";
import { authenticate } from "../middlewares/auth_middleware.js";

const router = Router();

// Phải đăng nhập mới được nộp hồ sơ
router.post("/", authenticate, ApplicationController.create);

export default router;
