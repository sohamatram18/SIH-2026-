import express from 'express';
import {
  getDashboardSummary,
  checkEligibility,
  getStudentApplications,
  getApplicationById,
  saveApplicationDraft,
  submitApplication,
  resolveDeficiency,
} from '../controllers/applicationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard/summary', getDashboardSummary);
router.get('/eligibility/check', checkEligibility);
router.get('/', getStudentApplications);
router.get('/:id', getApplicationById);
router.post('/draft', saveApplicationDraft);
router.post('/:id/submit', submitApplication);
router.post('/:id/deficiency/resolve', resolveDeficiency);

export default router;
