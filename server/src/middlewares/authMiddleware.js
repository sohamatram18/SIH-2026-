import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check httpOnly cookie
    if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }
    // 2. Fallback to Authorization Header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in with mobile OTP.',
      });
    }

    const secret = process.env.JWT_ACCESS_SECRET || 'mota_access_jwt_secret_tribal_scholarship_key_2026_india';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.userId).select('-refreshTokens');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or deactivated.',
      });
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      phone: user.phone,
      name: user.name,
      assignedState: user.assignedState,
      assignedAisheCode: user.assignedAisheCode,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Session has expired. Please refresh your session or log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid session credentials.',
    });
  }
};

export const requireAuth = authenticate;

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication required.',
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized for this operation.`,
      });
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const secret = process.env.JWT_ACCESS_SECRET || 'mota_access_jwt_secret_tribal_scholarship_key_2026_india';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.userId).select('-refreshTokens');
      if (user && user.isActive) {
        req.user = {
          userId: user._id.toString(),
          role: user.role,
          phone: user.phone,
          name: user.name,
          assignedState: user.assignedState,
          assignedAisheCode: user.assignedAisheCode,
        };
      }
    }
  } catch (err) {
    // Ignore invalid/expired token in optionalAuth
  }
  next();
};
