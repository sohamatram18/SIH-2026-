import { Payment } from '../models/Payment.js';
import { Student } from '../models/Student.js';
import { verificationService } from '../services/verificationAdapters.js';

export const getStudentPayments = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(200).json({ success: true, count: 0, payments: [], totals: {} });
    }

    const payments = await Payment.find({ studentId: student._id }).sort({ createdAt: -1 });

    let totalCredited = 0;
    let totalPending = 0;
    let totalFailed = 0;

    payments.forEach((p) => {
      if (p.status === 'Credited') totalCredited += p.amount;
      if (p.status === 'Pending' || p.status === 'Processed') totalPending += p.amount;
      if (p.status === 'Failed' || p.status === 'Rejected') totalFailed += p.amount;
    });

    const pfmsCheck = await verificationService.checkPfmsDbtStatus(student);

    return res.status(200).json({
      success: true,
      count: payments.length,
      totals: {
        totalCredited,
        totalPending,
        totalFailed,
      },
      pfmsBeneficiaryStatus: pfmsCheck.details,
      payments,
    });
  } catch (err) {
    next(err);
  }
};
