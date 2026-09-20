import mongoose from 'mongoose';
import { SCHEME_CODES, APPLICATION_STATUSES } from '../config/constants.js';

const timelineEventSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: ['Submission', 'Institute Verification', 'State Verification', 'Ministry Sanction', 'PFMS DBT Disbursement'],
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      default: '',
    },
    actor: {
      type: String,
      default: 'System',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const deficiencySchema = new mongoose.Schema(
  {
    deficiencyId: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'RESOLVED'],
      default: 'OPEN',
    },
    raisedBy: {
      type: String,
      default: 'Institute Nodal Officer',
    },
    raisedAt: {
      type: Date,
      default: Date.now,
    },
    studentResponse: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    schemeCode: {
      type: String,
      enum: Object.values(SCHEME_CODES),
      required: true,
      index: true,
    },
    schemeName: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      default: '2026-27',
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUSES),
      default: APPLICATION_STATUSES.DRAFT,
      index: true,
    },
    currentStep: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    // Snapshot of wizard form data saved at each step
    formData: {
      // Step 1: Personal & Domicile
      applicantName: String,
      dob: Date,
      gender: String,
      tribe: String,
      isPVTG: Boolean,
      pvtgCommunity: String,
      isDivyang: Boolean,
      divyangType: String,
      divyangPercentage: Number,
      state: String,
      district: String,
      address: String,
      pincode: String,
      apaarId: String,

      // Step 2: Academic & Institution
      courseLevel: String,
      course: String,
      yearOfStudy: Number,
      institutionName: String,
      aisheCode: String,
      isPremierInstitute: Boolean,
      isHosteller: Boolean,
      mastersPercentage: Number,

      // Step 3: Income & Calculated Allowances
      familyAnnualIncome: Number,
      estimatedMaintenanceAllowance: String,
      estimatedFeeReimbursement: String,
      estimatedTotalEntitlement: String,

      // Step 4: Documents Attached
      documentsAttached: [
        {
          docType: String,
          docName: String,
          isVerified: Boolean,
          verificationSource: String,
          verifiedAt: Date,
        },
      ],

      // Step 5: Statutory Undertaking
      dpdpConsentGiven: Boolean,
      noOtherScholarshipDeclared: Boolean,
    },
    timeline: [timelineEventSchema],
    deficiencies: [deficiencySchema],
    // For schemes where submission is handed off to NSP or State Portal
    externalHandoff: {
      portalName: String,
      portalUrl: String,
      externalApplicationId: String,
      redirectedAt: Date,
      isDirectSubmission: {
        type: Boolean,
        default: false,
      },
    },
    // DBT Payment Details (for Sanctioned / Disbursed state)
    dbtPayment: {
      amountSanctioned: Number,
      amountDisbursed: Number,
      paymentStatus: {
        type: String,
        enum: ['Pending', 'Processed', 'Credited', 'Rejected', null],
        default: null,
      },
      pfmsTransactionId: String,
      disbursedDate: Date,
      rejectionReason: String,
    },
    submissionDate: Date,
    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model('Application', applicationSchema);
