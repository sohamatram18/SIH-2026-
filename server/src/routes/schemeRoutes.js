import express from 'express';
import {
  getAllSchemes,
  getSchemeByCode,
  updateSchemeConfig,
  getInstitutions,
} from '../controllers/schemeController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Public routes for schemes
router.get('/', getAllSchemes);
router.get('/:code', getSchemeByCode);

// Admin-only route for editing scheme config
router.put('/:code', authenticate, requireRole(ROLES.MOTA_ADMIN), updateSchemeConfig);

export default router;
