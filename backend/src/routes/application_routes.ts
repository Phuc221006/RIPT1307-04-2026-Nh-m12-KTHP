import { Router } from "express";
import ApplicationController from "../controllers/application_controller.js";
import { updateStatus } from "../controllers/status_controller.js";
import { authenticate, authorize } from "../middlewares/auth_middleware.js"; 

const router = Router();

router.post("/", authenticate, ApplicationController.create);

router.patch('/:id/status', authenticate, authorize("ADMIN"), updateStatus);

export default router;