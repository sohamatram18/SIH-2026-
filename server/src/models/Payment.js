import mongoose from 'mongoose';
import { SCHEME_CODES } from '../config/constants.js';

const paymentSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentType: {
      type: String,
      enum: ['Maintenance Allowance', 'Compulsory Course Fees', 'Living Expenses', 'Laptop / Computer Grant', 'Books & Stationery Grant', 'Contingency Grant', 'Foreign Maintenance', 'Fellowship Stipend'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Credited', 'Processed', 'Pending', 'Failed', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    pfmsTransactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bankReferenceNo: {
      type: String,
    },
    bankName: {
      type: String,
    },
    maskedAccount: {
      type: String, // e.g. "••••••••3319"
    },
    ifscCode: {
      type: String,
    },
    creditDate: {
      type: Date,
    },
    failureReason: {
      type: String, // e.g. "Aadhaar not linked with bank account", "Dormant bank account", "IFSC invalid"
    },
    dbtBatchNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model('Payment', paymentSchema);
