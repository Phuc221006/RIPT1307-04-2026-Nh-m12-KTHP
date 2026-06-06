import { Router } from "express";
import { EducationController } from "../controllers/education_controller.js";

const router = Router();

// 3 Cổng API Public để Phúc gọi lấy dữ liệu đổ lên giao diện:
router.get("/universities", EducationController.getAllUnis);
router.get("/majors", EducationController.getAllMajors);
router.get("/combinations", EducationController.getAllCombos);

// Các API nghiệp vụ Quản trị (Thêm/Xóa) của ông giữ nguyên
router.post("/universities", EducationController.createUni);
router.delete("/universities/:id", EducationController.deleteUni);
router.post("/majors", EducationController.createMajor);
router.post("/combinations", EducationController.createCombo);

export default router;
