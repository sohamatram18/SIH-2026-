import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema(
  {
    aisheCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['IIT', 'IIM', 'AIIMS', 'NIT', 'IIIT', 'Central University', 'State University', 'Premier Autonomous', 'Secondary/Higher Secondary School', 'Other'],
      required: true,
    },
    state: {
      type: String,
      required: true,
      index: true,
    },
    district: {
      type: String,
    },
    isTopClassEligible: {
      type: Boolean,
      default: false,
      index: true, // Ministry listed 246/265 institutes
    },
    isUgcRecognised: {
      type: Boolean,
      default: true,
    },
    nodalOfficerEmail: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Institution = mongoose.model('Institution', institutionSchema);
