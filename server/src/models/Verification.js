import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      index: true,
    },
    adapterName: {
      type: String,
      required: true,
      index: true,
    },
    verificationType: {
      type: String, // 'CASTE_VERIFICATION', 'INCOME_VERIFICATION', 'AADHAAR_MATCH', 'AISHE_ACCREDITATION', 'UDISE_ENROLLMENT', 'APAAR_SYNC', 'PFMS_DBT_CHECK', 'UGC_NET_SCORE'
      required: true,
    },
    status: {
      type: String,
      enum: ['MATCH', 'MISMATCH', 'SOURCE_TIMEOUT', 'NEEDS_MANUAL_REVIEW', 'MANUAL_OVERRIDE_APPROVED', 'MANUAL_OVERRIDE_REJECTED'],
      required: true,
      index: true,
    },
    confidenceScore: {
      type: Number, // 0 to 100
      default: 100,
    },
    discrepancyDetails: {
      type: String,
    },
    sourcePayloadSummary: {
      type: mongoose.Schema.Types.Mixed, // Sanitized, no raw PII
    },
    reviewedBy: {
      type: String, // Officer Name or "Automated Verification Pipeline"
      default: 'Automated Verification Layer',
    },
    reviewerRole: {
      type: String, // 'system', 'institute_nodal', 'state_nodal', 'mota_admin'
      default: 'system',
    },
    reviewRemarks: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

export const Verification = mongoose.model('Verification', verificationSchema);
