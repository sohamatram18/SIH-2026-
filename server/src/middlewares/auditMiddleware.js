import { AuditLog } from '../models/AuditLog.js';
import pino from 'pino';

const logger = pino();

export const logAudit = async ({
  action,
  req,
  targetEntity = 'System',
  targetId = null,
  metadata = {},
}) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const role = req.user ? req.user.role : 'anonymous';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Scrub any accidental PII from metadata
    const cleanMeta = { ...metadata };
    delete cleanMeta.password;
    delete cleanMeta.otp;
    delete cleanMeta.fullAadhaar;
    delete cleanMeta.accountNumber;

    await AuditLog.create({
      action,
      userId,
      role,
      targetEntity,
      targetId: targetId ? String(targetId) : null,
      ipAddress: String(ipAddress),
      userAgent: String(userAgent).substring(0, 200),
      metadata: cleanMeta,
      timestamp: new Date(),
    });
  } catch (err) {
    logger.warn(`Failed to write audit log: ${err.message}`);
  }
};
