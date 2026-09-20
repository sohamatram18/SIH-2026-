import express from 'express';
import {
  getProfile,
  updateProfile,
  getGuardianStudents,
  linkGuardianStudent,
} from '../controllers/profileController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);

// Guardian specific endpoints
router.get('/guardian/wards', requireRole(ROLES.GUARDIAN, ROLES.MOTA_ADMIN), getGuardianStudents);
router.post('/guardian/link', requireRole(ROLES.GUARDIAN, ROLES.MOTA_ADMIN), linkGuardianStudent);

export default router;
