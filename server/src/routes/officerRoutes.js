import express from 'express';
import {
  getOfficerDashboard,
  getScrutinyApplications,
  batchScrutinyAction,
  generateSanctionOrder,
  generatePfmsDbtBatch,
  getCoverageGapStats,
} from '../controllers/officerController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All officer routes require authenticated officer or admin role
router.use(requireAuth);
router.use(requireRole(['institute_nodal', 'state_nodal', 'mota_admin']));

router.get('/dashboard', getOfficerDashboard);
router.get('/applications', getScrutinyApplications);
router.post('/batch-action', batchScrutinyAction);
router.post('/sanction-order', requireRole(['mota_admin', 'state_nodal']), generateSanctionOrder);
router.post('/pfms-dbt-batch', requireRole(['mota_admin']), generatePfmsDbtBatch);
router.get('/coverage-gap', getCoverageGapStats);

export default router;
