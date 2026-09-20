import express from 'express';
import {
  raiseGrievance,
  getGrievances,
  getGrievanceById,
  escalateGrievance,
} from '../controllers/grievanceController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', raiseGrievance);
router.get('/', getGrievances);
router.get('/:id', getGrievanceById);
router.post('/:id/escalate', escalateGrievance);

export default router;
