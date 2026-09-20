import express from 'express';
import {
  sendOtp,
  verifyOtp,
  refreshTokenHandler,
  logout,
  getMe,
  demoLogin,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh-token', refreshTokenHandler);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/demo-login', demoLogin);

export default router;
