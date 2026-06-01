import { Router } from "express";
import AdminController from "../controllers/admin_controller.js";
import { authenticate } from "../middlewares/auth_middleware.js";
import { requireAdmin } from "../middlewares/admin_middleware.js";

const router = Router();

router.get("/statistics", authenticate, requireAdmin, AdminController.getStatistics);
router.get("/applications", authenticate, requireAdmin, AdminController.getAllApplications);
router.patch("/applications/:id/status", authenticate, requireAdmin, AdminController.updateStatus);
router.get("/universities", AdminController.getUniversities);
router.get("/majors", AdminController.getMajors);
router.get("/combinations", AdminController.getCombinations);
export default router;