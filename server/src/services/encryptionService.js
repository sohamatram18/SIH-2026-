import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

// Key should be 32 bytes (64 hex characters)
const getSecretKey = () => {
  const envKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  return Buffer.from(envKey.padEnd(64, '0').slice(0, 64), 'hex');
};

/**
 * Encrypt sensitive string (e.g. bank account number) using AES-256-GCM
 */
export const encrypt = (plainText) => {
  if (!plainText) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  
  let encrypted = cipher.update(String(plainText), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypt string encrypted with AES-256-GCM
 */
export const decrypt = (cipherTextWithMeta) => {
  if (!cipherTextWithMeta) return null;
  try {
    const [ivHex, authTagHex, encryptedHex] = cipherTextWithMeta.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) return null;

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return null;
  }
};

/**
 * Generate a cryptographically secure, irreversible verification token for Aadhaar
 * (HMAC-SHA256), ensuring full number is never stored in plaintext or reversible form.
 */
export const generateAadhaarToken = (fullAadhaar) => {
  if (!fullAadhaar) return null;
  const cleanNumber = String(fullAadhaar).replace(/\D/g, '');
  return crypto.createHmac('sha256', getSecretKey()).update(cleanNumber).digest('hex');
};

/**
 * Mask Aadhaar showing only last 4 digits (e.g. "XXXXXXXX4829")
 */
export const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return 'XXXXXXXX----';
  const clean = String(aadhaar).replace(/\D/g, '');
  const last4 = clean.slice(-4);
  return `XXXXXXXX${last4}`;
};

/**
 * Mask Bank Account showing only last 4 digits (e.g. "••••••••5621")
 */
export const maskBankAccount = (accountNumber) => {
  if (!accountNumber) return '••••••••----';
  const clean = String(accountNumber).trim();
  const last4 = clean.slice(-4);
  return `••••••••${last4}`;
};
