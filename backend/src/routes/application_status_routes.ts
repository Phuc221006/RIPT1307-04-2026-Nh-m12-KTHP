import { Router } from "express";
import ApplicationStatusController from "../controllers/application_status_controller.js";
import { authenticate, authorize } from "../middlewares/auth_middleware.js";

const router = Router();

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  ApplicationStatusController.updateStatus,
);

export default router;
