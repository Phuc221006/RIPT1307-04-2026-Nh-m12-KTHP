import { Router } from "express";
import { EducationController } from "../controllers/education_controller.js";

const router = Router();

router.get("/universities", EducationController.getAllUnis);
router.post("/universities", EducationController.createUni);
router.put("/universities/:id", EducationController.updateUni);
router.delete("/universities/:id", EducationController.deleteUni);

router.get("/majors", EducationController.getAllMajors);
router.post("/majors", EducationController.createMajor);
router.put("/majors/:id", EducationController.updateMajor);
router.delete("/majors/:id", EducationController.deleteMajor);

router.get("/combinations", EducationController.getAllCombos);
router.post("/combinations", EducationController.createCombo);
router.put("/combinations/:id", EducationController.updateCombo);
router.delete("/combinations/:id", EducationController.deleteCombo);

export default router;
