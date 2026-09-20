import mongoose from 'mongoose';
import { COURSE_LEVELS } from '../config/constants.js';

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    guardianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Transgender', 'Prefer not to say'],
      required: true,
    },
    // Tribal Identity
    tribe: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    isPVTG: {
      type: Boolean,
      default: false,
      index: true,
    },
    pvtgCommunity: {
      type: String,
      trim: true,
    },
    // Divyang (Persons with Disabilities / PwD)
    isDivyang: {
      type: Boolean,
      default: false,
      index: true,
    },
    divyangType: {
      type: String,
      trim: true,
    },
    divyangPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    // Location Details
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    // Financial & Academic
    familyAnnualIncome: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    apaarId: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    currentClass: {
      type: Number, // IX, X for pre-matric
      min: 1,
      max: 12,
    },
    courseLevel: {
      type: String,
      enum: Object.values(COURSE_LEVELS),
      required: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfStudy: {
      type: Number,
      default: 1,
    },
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    aisheCode: {
      type: String,
      trim: true,
      index: true,
    },
    isHosteller: {
      type: Boolean,
      default: false,
    },
    // Academic Marks (relevant for merit in NFST, NOS, etc.)
    mastersPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    // Aadhaar Details - STRICT PRIVACY COMPLIANCE: No raw full Aadhaar is stored
    aadhaarDetails: {
      aadhaarLast4: {
        type: String,
        length: 4,
        required: true,
      },
      aadhaarVerificationToken: {
        type: String,
        required: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: {
        type: Date,
      },
      consentGivenAt: {
        type: Date,
        default: Date.now,
      },
    },
    // Bank Details - Field level encrypted token + masked display
    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      maskedAccountNumber: {
        type: String,
        trim: true,
      },
      encryptedAccountToken: {
        type: String,
      },
      isDbtLinked: {
        type: Boolean,
        default: true,
      },
    },
    // One Scheme at a Time rule tracking
    activeScholarship: {
      schemeCode: {
        type: String,
        enum: ['PRE_MATRIC', 'POST_MATRIC', 'TOP_CLASS', 'NFST', 'NOS', null],
        default: null,
      },
      applicationId: {
        type: String,
      },
      schemeName: {
        type: String,
      },
      sanctionedYear: {
        type: String,
      },
      status: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model('Student', studentSchema);
