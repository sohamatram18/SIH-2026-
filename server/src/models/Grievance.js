import mongoose from 'mongoose';
import { SCHEME_CODES } from '../config/constants.js';

const grievanceSchema = new mongoose.Schema(
  {
    ticketNumber: {
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
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      index: true,
    },
    schemeCode: {
      type: String,
      enum: [...Object.values(SCHEME_CODES), 'GENERAL'],
      default: 'GENERAL',
      index: true,
    },
    category: {
      type: String,
      enum: [
        'DBT_DISBURSEMENT_DELAY',
        'INSTITUTE_VERIFICATION_DELAY',
        'STATE_SCRUTINY_QUERY',
        'DEFICIENCY_CLARIFICATION',
        'DOCUMENT_MISMATCH_QUERY',
        'INCORRECT_BANK_ACCOUNT',
        'TECHNICAL_GLITCH',
        'OTHER',
      ],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_PROCESS', 'RESOLVED', 'ESCALATED'],
      default: 'OPEN',
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    helplineRouting: {
      email: String,
      portal: String,
      helpline: String,
    },
    officerResponse: {
      type: String,
    },
    resolvedBy: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
    escalatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Grievance = mongoose.model('Grievance', grievanceSchema);
