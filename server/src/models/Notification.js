import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['STATUS_UPDATE', 'DEFICIENCY', 'DBT_CREDIT', 'REMINDER', 'GRIEVANCE', 'SECURITY'],
      default: 'STATUS_UPDATE',
      index: true,
    },
    schemeCode: {
      type: String,
    },
    actionUrl: {
      type: String, // e.g. "/apply/NFST/..." or "/payments" or "/wallet"
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    channel: {
      type: String,
      enum: ['IN_APP', 'SMS', 'PUSH', 'EMAIL'],
      default: 'IN_APP',
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
