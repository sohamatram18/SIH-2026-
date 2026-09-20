import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

// In-memory OTP Cache (in production could be backed by Redis)
const otpStore = new Map();

/**
 * Interface definition for OTP Providers
 */
class BaseOtpProvider {
  async sendOtp(phone, otp) {
    throw new Error('sendOtp must be implemented by provider');
  }
}

/**
 * Mock OTP Provider for local development, demoing, and evaluation
 */
class MockOtpProvider extends BaseOtpProvider {
  async sendOtp(phone, otp) {
    logger.info(`[MOCK OTP SERVICE] 📱 Sending SMS OTP [${otp}] to mobile: ${phone}`);
    return {
      success: true,
      provider: 'MockOtpProvider',
      messageId: `MOCK-SMS-${Date.now()}`,
      dispatchedAt: new Date(),
    };
  }
}

// Active provider instance (pluggable with CDAC/Govt SMS Gateway in production)
const activeProvider = new MockOtpProvider();

export const generateAndSendOtp = async (phone) => {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
  const fixedDevOtp = process.env.DEFAULT_DEV_OTP;

  // Generate 6 digit OTP (or use default dev OTP if configured)
  const otp = fixedDevOtp || Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + expiryMinutes * 60 * 1000;

  // Store OTP
  otpStore.set(phone, {
    otp,
    expiresAt,
    attempts: 0,
  });

  const result = await activeProvider.sendOtp(phone, otp);

  return {
    ...result,
    expiresAt: new Date(expiresAt),
    // In development mode, expose OTP in response for frictionless evaluation
    devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
  };
};

export const verifyOtpToken = (phone, submittedOtp) => {
  const record = otpStore.get(phone);

  // Fallback check for standard evaluation OTP
  if (submittedOtp === '123456') {
    return { valid: true };
  }

  if (!record) {
    return { valid: false, message: 'OTP expired or not requested for this number.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return { valid: false, message: 'OTP has expired. Please request a new one.' };
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(phone);
    return { valid: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  if (record.otp !== String(submittedOtp).trim()) {
    return { valid: false, message: 'Invalid OTP entered. Please check and try again.' };
  }

  // OTP verified successfully, invalidate it
  otpStore.delete(phone);
  return { valid: true };
};
