import mongoose from 'mongoose';
import { SCHEME_CODES } from '../config/constants.js';

const schemeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      enum: Object.values(SCHEME_CODES),
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Centrally Sponsored', 'Central Sector'],
      required: true,
    },
    portalUrl: {
      type: String,
      required: true,
    },
    portalName: {
      type: String,
      required: true,
    },
    fundingSplitInfo: {
      type: String,
      default: '100% Central Sector Funding',
    },
    description: {
      type: String,
      required: true,
    },
    // Dynamic Eligibility Rules (Admin Editable)
    eligibility: {
      minIncomeLakhs: {
        type: Number,
        default: 0,
      },
      maxIncomeLakhs: {
        type: Number,
        required: true,
      },
      classRange: {
        minClass: Number,
        maxClass: Number,
      },
      allowedCourseLevels: [
        {
          type: String,
        },
      ],
      requiresPremierInstitute: {
        type: Boolean,
        default: false,
      },
      requiresUgcRecognised: {
        type: Boolean,
        default: false,
      },
      requiresForeignAdmission: {
        type: Boolean,
        default: false,
      },
      foreignAdmissionTimeLimitYears: {
        type: Number,
      },
      annualAwardCap: {
        total: Number,
        generalST: Number,
        pvtgQuota: Number,
      },
      meritCriteria: {
        type: String,
      },
      preferences: [
        {
          type: String,
        },
      ],
    },
    // Allowance Breakdown
    allowanceStructure: {
      description: {
        type: String,
        required: true,
      },
      components: [
        {
          title: String,
          amount: String,
          frequency: String,
          notes: String,
        },
      ],
    },
    dbtProvider: {
      type: String,
      default: 'PFMS (Public Financial Management System)',
    },
    grievanceContact: {
      portal: {
        type: String,
        default: 'https://tribal.nic.in/Grievance',
      },
      email: {
        type: String,
        required: true,
      },
      helpline: {
        type: String,
      },
    },
    documentsRequired: [
      {
        docType: String,
        name: String,
        isMandatory: Boolean,
        description: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    lastModifiedBy: {
      type: String,
      default: 'System Seed',
    },
  },
  {
    timestamps: true,
  }
);

export const Scheme = mongoose.model('Scheme', schemeSchema);
