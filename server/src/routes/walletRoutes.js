import express from 'express';
import {
  getWalletDocuments,
  fetchFromDigiLocker,
  uploadDocument,
  verifyDocumentOnDemand,
  getManualReviewQueue,
  resolveManualReview,
} from '../controllers/walletController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/rbacMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getWalletDocuments);
router.post('/digilocker-fetch', fetchFromDigiLocker);
router.post('/upload', uploadDocument);
router.post('/:id/verify', verifyDocumentOnDemand);

// Officer Manual Review Queue
router.get('/review-queue', requireRole(ROLES.INSTITUTE_NODAL, ROLES.STATE_NODAL, ROLES.MOTA_ADMIN), getManualReviewQueue);
router.post('/review-queue/:id/resolve', requireRole(ROLES.INSTITUTE_NODAL, ROLES.STATE_NODAL, ROLES.MOTA_ADMIN), resolveManualReview);

export default router;
