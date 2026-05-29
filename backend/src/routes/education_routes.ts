import { Router } from 'express';
import { EducationController } from '../controllers/education_controller';

const router = Router();

router.post('/universities', EducationController.createUni);
router.get('/universities', EducationController.getAllUnis);
router.delete('/universities/:id', EducationController.deleteUni);

router.post('/majors', EducationController.createMajor);
router.post('/combinations', EducationController.createCombo);

export default router;