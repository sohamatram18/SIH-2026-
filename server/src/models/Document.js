import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    docType: {
      type: String,
      enum: [
        'ST_CERTIFICATE',
        'INCOME_CERTIFICATE',
        'DOMICILE_CERTIFICATE',
        'PREVIOUS_MARKSHEET',
        'MASTERS_MARKSHEET',
        'BONAFIDE_STUDENT',
        'FEE_RECEIPT',
        'BANK_PASSBOOK',
        'DIVYANG_CERTIFICATE',
        'NET_JRF_SCORECARD',
        'PASSPORT_COPY',
        'PVTG_CERTIFICATE',
        'RESEARCH_SYNOPSIS',
        'FOREIGN_OFFER_LETTER',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    documentNumber: {
      type: String,
      trim: true,
    },
    issuingAuthority: {
      type: String,
      trim: true,
    },
    issuedDate: {
      type: Date,
    },
    validUntil: {
      type: Date,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ['DIGILOCKER', 'UPLOAD', 'EDISTRICT', 'UIDAI'],
      default: 'UPLOAD',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: String, // e.g. "450 KB"
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'PENDING', 'NEEDS_MANUAL_REVIEW', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    verificationSource: {
      type: String, // e.g. "DigiLocker Certified", "State e-District API", "Institute Officer Scrutiny"
    },
    verifiedAt: {
      type: Date,
    },
    verificationMetadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    isSharedAcrossSchemes: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.model('Document', documentSchema);
