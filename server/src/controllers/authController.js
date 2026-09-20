import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { ROLES } from '../config/constants.js';
import { generateAndSendOtp, verifyOtpToken } from '../services/otpService.js';
import { logAudit } from '../middlewares/auditMiddleware.js';

const sendOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  otp: z.string().min(4).max(6),
  role: z.nativeEnum(ROLES).optional(),
  name: z.string().optional(),
});

const createTokens = (userId, role) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET || 'mota_access_jwt_secret_tribal_scholarship_key_2026_india';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'mota_refresh_jwt_secret_tribal_scholarship_key_2026_india';

  const accessToken = jwt.sign({ userId, role }, accessSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, role }, refreshSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  };

  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = sendOtpSchema.parse(req.body);

    const result = await generateAndSendOtp(phone);

    await logAudit({
      action: 'AUTH_SEND_OTP',
      req,
      targetEntity: 'User',
      metadata: { phoneMasked: `${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}` },
    });

    return res.status(200).json({
      success: true,
      message: `OTP has been dispatched to +91-${phone.slice(0, 2)}******${phone.slice(-2)}. Valid for 10 minutes.`,
      dispatchedAt: result.dispatchedAt,
      // Provided in development/evaluation for ease of testing
      devOtp: result.devOtp,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, role, name } = verifyOtpSchema.parse(req.body);

    const verification = verifyOtpToken(phone, otp);
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        phone,
        role: role || ROLES.STUDENT,
        name: name || 'Tribal Beneficiary',
        isPhoneVerified: true,
        lastLoginAt: new Date(),
      });
    } else {
      user.lastLoginAt = new Date();
      await user.save();
    }

    const { accessToken, refreshToken } = createTokens(user._id.toString(), user.role);

    // Save refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    if (user.refreshTokens.length > 5) {
      user.refreshTokens.shift(); // Keep latest 5 active sessions
    }
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    let studentProfile = null;
    if (user.role === ROLES.STUDENT) {
      studentProfile = await Student.findOne({ userId: user._id });
    }

    await logAudit({
      action: 'AUTH_LOGIN_SUCCESS',
      req,
      targetEntity: 'User',
      targetId: user._id,
      metadata: { role: user.role, isNewUser },
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome to MoTA Unified Scholarship Portal.',
      accessToken,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name,
        assignedState: user.assignedState,
        assignedAisheCode: user.assignedAisheCode,
        hasProfile: !!studentProfile,
      },
      student: studentProfile,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshTokenHandler = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token || req.body.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided.',
      });
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'mota_refresh_jwt_secret_tribal_scholarship_key_2026_india';
    const decoded = jwt.verify(token, refreshSecret);

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.some((rt) => rt.token === token)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or revoked refresh token. Please sign in again.',
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = createTokens(user._id.toString(), user.role);

    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== token);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    setAuthCookies(res, accessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Expired or corrupted session token. Please log in again.',
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    if (token && req.user) {
      await User.findByIdAndUpdate(req.user.userId, {
        $pull: { refreshTokens: { token } },
      });
    }

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    await logAudit({
      action: 'AUTH_LOGOUT',
      req,
      targetEntity: 'User',
      targetId: req.user ? req.user.userId : null,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-refreshTokens');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let student = null;
    if (user.role === ROLES.STUDENT) {
      student = await Student.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name,
        assignedState: user.assignedState,
        assignedAisheCode: user.assignedAisheCode,
        hasProfile: !!student,
      },
      student,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 1-Click Demo Login to rapidly evaluate the portal across all 5 roles
 */
export const demoLogin = async (req, res, next) => {
  try {
    const { demoRole = 'student_prematric' } = req.body;

    const phoneMap = {
      student_prematric: '9876543210',
      student_postmatric: '9876543211',
      student_topclass: '9876543212',
      student_nfst: '9876543213',
      student_nos: '9876543214',
      guardian: '9876543220',
      institute_nodal: '9876543230',
      state_nodal: '9876543240',
      mota_admin: '9876543250',
    };

    const targetPhone = phoneMap[demoRole] || phoneMap.student_prematric;
    const user = await User.findOne({ phone: targetPhone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Demo user not found. Please run database seed first. Target phone: ${targetPhone}`,
      });
    }

    const { accessToken, refreshToken } = createTokens(user._id.toString(), user.role);
    setAuthCookies(res, accessToken, refreshToken);

    let student = null;
    if (user.role === ROLES.STUDENT) {
      student = await Student.findOne({ userId: user._id });
    }

    await logAudit({
      action: 'DEMO_LOGIN',
      req,
      targetEntity: 'User',
      targetId: user._id,
      metadata: { demoRole },
    });

    return res.status(200).json({
      success: true,
      message: `Logged in as Demo Persona: ${user.name} (${user.role})`,
      accessToken,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name,
        assignedState: user.assignedState,
        assignedAisheCode: user.assignedAisheCode,
        hasProfile: !!student,
      },
      student,
    });
  } catch (err) {
    next(err);
  }
};
