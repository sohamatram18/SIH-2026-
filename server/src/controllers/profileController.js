import { z } from 'zod';
import { Student } from '../models/Student.js';
import { User } from '../models/User.js';
import { ROLES, COURSE_LEVELS } from '../config/constants.js';
import {
  encrypt,
  generateAadhaarToken,
  maskAadhaar,
  maskBankAccount,
} from '../services/encryptionService.js';
import { logAudit } from '../middlewares/auditMiddleware.js';

const studentProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  dob: z.string().or(z.date()),
  gender: z.enum(['Male', 'Female', 'Transgender', 'Prefer not to say']),
  tribe: z.string().min(2, 'Scheduled Tribe community name is required'),
  isPVTG: z.boolean().default(false),
  pvtgCommunity: z.string().optional(),
  isDivyang: z.boolean().default(false),
  divyangType: z.string().optional(),
  divyangPercentage: z.number().min(0).max(100).optional(),
  state: z.string().min(2, 'State of domicile is required'),
  district: z.string().min(2, 'District is required'),
  address: z.string().optional(),
  pincode: z.string().optional(),
  familyAnnualIncome: z.number().min(0, 'Income must be non-negative'),
  apaarId: z.string().optional(),
  currentClass: z.number().min(1).max(12).optional(),
  courseLevel: z.nativeEnum(COURSE_LEVELS),
  course: z.string().min(2, 'Current course/degree name is required'),
  yearOfStudy: z.number().min(1).max(7).default(1),
  institutionName: z.string().min(2, 'Institution name is required'),
  aisheCode: z.string().optional(),
  isHosteller: z.boolean().default(false),
  mastersPercentage: z.number().min(0).max(100).optional(),
  // Aadhaar input: user can supply last 4 digits directly, or a 12-digit number which is immediately tokenized and NEVER saved
  rawAadhaar: z.string().optional(),
  aadhaarLast4: z.string().length(4).optional(),
  // Bank details
  accountHolderName: z.string().optional(),
  ifscCode: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  consentGiven: z.boolean().default(true),
});

export const getProfile = async (req, res, next) => {
  try {
    const { userId, role } = req.user;

    if (role === ROLES.GUARDIAN) {
      // Return guardian info and their linked wards
      const wards = await Student.find({ guardianId: userId });
      return res.status(200).json({
        success: true,
        role: ROLES.GUARDIAN,
        wardsCount: wards.length,
        wards,
      });
    }

    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(200).json({
        success: true,
        hasProfile: false,
        message: 'Profile has not been set up yet. Please complete your profile registration.',
        student: null,
      });
    }

    // Return sanitized profile (never exposing decrypted full bank account or aadhaar token)
    return res.status(200).json({
      success: true,
      hasProfile: true,
      student,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    if (role !== ROLES.STUDENT) {
      return res.status(403).json({
        success: false,
        message: 'Only student accounts can directly update their primary student profile.',
      });
    }

    const validatedData = studentProfileSchema.parse(req.body);

    let student = await Student.findOne({ userId });

    // Handle Aadhaar DPDP compliance
    let aadhaarLast4 = student?.aadhaarDetails?.aadhaarLast4 || '0000';
    let aadhaarToken = student?.aadhaarDetails?.aadhaarVerificationToken || 'TOKEN_PENDING';
    let isAadhaarVerified = student?.aadhaarDetails?.isVerified || false;

    if (validatedData.rawAadhaar) {
      const cleanAadhaar = validatedData.rawAadhaar.replace(/\D/g, '');
      if (cleanAadhaar.length === 12) {
        aadhaarLast4 = cleanAadhaar.slice(-4);
        aadhaarToken = generateAadhaarToken(cleanAadhaar);
        isAadhaarVerified = true;
      }
    } else if (validatedData.aadhaarLast4) {
      aadhaarLast4 = validatedData.aadhaarLast4;
    }

    // Handle Bank details with encryption
    let maskedAcc = student?.bankDetails?.maskedAccountNumber || '';
    let encryptedAccToken = student?.bankDetails?.encryptedAccountToken || '';

    if (validatedData.accountNumber) {
      maskedAcc = maskBankAccount(validatedData.accountNumber);
      encryptedAccToken = encrypt(validatedData.accountNumber);
    }

    const profilePayload = {
      userId,
      name: validatedData.name,
      dob: new Date(validatedData.dob),
      gender: validatedData.gender,
      tribe: validatedData.tribe,
      isPVTG: validatedData.isPVTG,
      pvtgCommunity: validatedData.pvtgCommunity || '',
      isDivyang: validatedData.isDivyang,
      divyangType: validatedData.divyangType || '',
      divyangPercentage: validatedData.divyangPercentage,
      state: validatedData.state,
      district: validatedData.district,
      address: validatedData.address || '',
      pincode: validatedData.pincode || '',
      familyAnnualIncome: validatedData.familyAnnualIncome,
      apaarId: validatedData.apaarId || '',
      currentClass: validatedData.currentClass,
      courseLevel: validatedData.courseLevel,
      course: validatedData.course,
      yearOfStudy: validatedData.yearOfStudy,
      institutionName: validatedData.institutionName,
      aisheCode: validatedData.aisheCode || '',
      isHosteller: validatedData.isHosteller,
      mastersPercentage: validatedData.mastersPercentage,
      aadhaarDetails: {
        aadhaarLast4,
        aadhaarVerificationToken: aadhaarToken,
        isVerified: isAadhaarVerified,
        verifiedAt: isAadhaarVerified ? new Date() : undefined,
        consentGivenAt: new Date(),
      },
      bankDetails: {
        accountHolderName: validatedData.accountHolderName || validatedData.name,
        ifscCode: validatedData.ifscCode || '',
        bankName: validatedData.bankName || '',
        maskedAccountNumber: maskedAcc,
        encryptedAccountToken: encryptedAccToken,
        isDbtLinked: true,
      },
    };

    if (student) {
      Object.assign(student, profilePayload);
      await student.save();
    } else {
      student = await Student.create(profilePayload);
      // Update User name as well
      await User.findByIdAndUpdate(userId, { name: validatedData.name });
    }

    await logAudit({
      action: 'PROFILE_UPDATED',
      req,
      targetEntity: 'Student',
      targetId: student._id,
      metadata: {
        tribe: student.tribe,
        isPVTG: student.isPVTG,
        state: student.state,
        courseLevel: student.courseLevel,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Student profile updated successfully with DPDP compliance.',
      student,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Guardian: view linked children
 */
export const getGuardianStudents = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    if (role !== ROLES.GUARDIAN && role !== ROLES.MOTA_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to Guardians and MoTA Admin.',
      });
    }

    const wards = await Student.find({ guardianId: userId });
    return res.status(200).json({
      success: true,
      count: wards.length,
      wards,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Guardian: link an existing student profile to guardian's family view
 */
export const linkGuardianStudent = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { apaarId, studentPhone, aadhaarLast4 } = req.body;

    let student = null;
    if (apaarId) {
      student = await Student.findOne({ apaarId });
    } else if (studentPhone) {
      const studentUser = await User.findOne({ phone: studentPhone });
      if (studentUser) {
        student = await Student.findOne({ userId: studentUser._id });
      }
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'No student record found matching the provided APAAR ID or phone number.',
      });
    }

    if (aadhaarLast4 && student.aadhaarDetails.aadhaarLast4 !== aadhaarLast4) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar last 4 digits do not match the student record.',
      });
    }

    student.guardianId = userId;
    await student.save();

    await logAudit({
      action: 'GUARDIAN_LINK_STUDENT',
      req,
      targetEntity: 'Student',
      targetId: student._id,
      metadata: { guardianId: userId },
    });

    return res.status(200).json({
      success: true,
      message: `Successfully linked ward ${student.name} to guardian family dashboard.`,
      student,
    });
  } catch (err) {
    next(err);
  }
};
