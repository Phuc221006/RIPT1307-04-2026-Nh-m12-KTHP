import { Router } from "express";
import FileController from "../controllers/file_controller.js";

const router = Router();

// GET /api/v1/files/preview?url=...&name=...
router.get("/preview", FileController.previewRemote);

export default router;
