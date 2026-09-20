import express from 'express';
import { getStudentPayments } from '../controllers/paymentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getStudentPayments);

export default router;
