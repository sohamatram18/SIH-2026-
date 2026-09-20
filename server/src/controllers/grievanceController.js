import { Grievance } from '../models/Grievance.js';
import { Student } from '../models/Student.js';
import { Scheme } from '../models/Scheme.js';
import { logAudit } from '../middlewares/auditMiddleware.js';

export const raiseGrievance = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { schemeCode, applicationId, category, subject, description, priority } = req.body;

    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(400).json({ success: false, message: 'Student profile required.' });
    }

    const ticketNumber = `GRV/${new Date().getFullYear()}/${(schemeCode || 'GEN').slice(0, 4)}/${Math.floor(10000 + Math.random() * 90000)}`;

    let helplineRouting = {
      email: 'edu-tribal@nic.in',
      portal: 'https://tribal.nic.in/Grievance',
      helpline: '1800-11-7777',
    };

    if (schemeCode) {
      const scheme = await Scheme.findOne({ code: schemeCode.toUpperCase() });
      if (scheme && scheme.grievanceContact) {
        helplineRouting = scheme.grievanceContact;
      }
    }

    const grievance = await Grievance.create({
      ticketNumber,
      studentId: student._id,
      userId,
      applicationId: applicationId || undefined,
      schemeCode: schemeCode || 'GENERAL',
      category,
      subject,
      description,
      priority: priority || 'NORMAL',
      helplineRouting,
      status: 'OPEN',
    });

    await logAudit({
      action: 'GRIEVANCE_RAISED',
      req,
      targetEntity: 'Grievance',
      targetId: grievance._id,
      metadata: { ticketNumber, category, schemeCode },
    });

    return res.status(201).json({
      success: true,
      message: `Grievance ticket ${ticketNumber} raised successfully. Ministry helpline notified.`,
      grievance,
    });
  } catch (err) {
    next(err);
  }
};

export const getGrievances = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const grievances = await Grievance.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: grievances.length,
      grievances,
    });
  } catch (err) {
    next(err);
  }
};

export const getGrievanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const grievance = await Grievance.findOne({ _id: id, userId });
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance ticket not found.' });
    }

    return res.status(200).json({
      success: true,
      grievance,
    });
  } catch (err) {
    next(err);
  }
};

export const escalateGrievance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const grievance = await Grievance.findOne({ _id: id, userId });
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance ticket not found.' });
    }

    grievance.status = 'ESCALATED';
    grievance.priority = 'URGENT';
    grievance.escalatedAt = new Date();
    await grievance.save();

    await logAudit({
      action: 'GRIEVANCE_ESCALATED',
      req,
      targetEntity: 'Grievance',
      targetId: grievance._id,
      metadata: { ticketNumber: grievance.ticketNumber },
    });

    return res.status(200).json({
      success: true,
      message: `Grievance ticket ${grievance.ticketNumber} escalated to Ministry Appellate Authority.`,
      grievance,
    });
  } catch (err) {
    next(err);
  }
};
