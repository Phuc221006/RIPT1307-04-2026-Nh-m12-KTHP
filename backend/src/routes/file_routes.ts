import { Router } from "express";
import FileController from "../controllers/file_controller.js";

const router = Router();

// GET /uploads/documents/:filename — xem file minh chứng (legacy local storage)
router.get("/documents/:filename", FileController.viewDocument);

export default router;
