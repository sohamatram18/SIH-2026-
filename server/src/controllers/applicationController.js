import { Application } from '../models/Application.js';
import { Student } from '../models/Student.js';
import { Scheme } from '../models/Scheme.js';
import { Institution } from '../models/Institution.js';
import { APPLICATION_STATUSES, SCHEME_CODES } from '../config/constants.js';
import { evaluateStudentEligibility, evaluateAllSchemesForStudent, checkScholarshipConflict } from '../services/eligibilityEngine.js';
import { logAudit } from '../middlewares/auditMiddleware.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const student = await Student.findOne({ userId });

    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: 1 });
    const applications = student
      ? await Application.find({ studentId: student._id }).sort({ updatedAt: -1 })
      : [];

    // Map each of the 5 schemes to its current status
    const schemeStatuses = schemes.map((scheme) => {
      const app = applications.find((a) => a.schemeCode === scheme.code);
      let status = APPLICATION_STATUSES.NOT_APPLIED;
      let applicationId = null;

      if (app) {
        status = app.status;
        applicationId = app._id;
      } else if (student?.activeScholarship?.schemeCode === scheme.code) {
        status = student.activeScholarship.status || APPLICATION_STATUSES.SANCTIONED;
        applicationId = student.activeScholarship.applicationId;
      }

      return {
        code: scheme.code,
        name: scheme.name,
        shortName: scheme.shortName,
        category: scheme.category,
        portalName: scheme.portalName,
        status,
        applicationId,
        allowanceSummary: scheme.allowanceStructure?.description,
      };
    });

    // Active Application Timeline (pick most recent non-draft application or student active scholarship)
    const activeApp = applications.find((a) => a.status !== APPLICATION_STATUSES.DRAFT) || applications[0];
    let timeline = activeApp ? activeApp.timeline : [];

    // Fallback default timeline if no application exists yet
    if (!timeline || timeline.length === 0) {
      timeline = [
        { stage: 'Submission', status: 'Pending', remarks: 'Awaiting student application submission' },
        { stage: 'Institute Verification', status: 'Pending', remarks: 'Nodal officer verification' },
        { stage: 'State Verification', status: 'Pending', remarks: 'State tribal welfare scrutiny' },
        { stage: 'Ministry Sanction', status: 'Pending', remarks: 'Central sanction generation' },
        { stage: 'PFMS DBT Disbursement', status: 'Pending', remarks: 'Direct credit to Aadhaar-seeded bank' },
      ];
    }

    // Pending Actions Panel Formulation
    const pendingActions = [];

    // Action: Incomplete profile
    if (!student || !student.aadhaarDetails?.isVerified) {
      pendingActions.push({
        id: 'ACTION_PROFILE',
        title: 'Complete Profile & Aadhaar Verification',
        description: 'Profile is required before scholarship applications can be submitted.',
        actionUrl: '/profile',
        actionLabel: 'Update Profile',
        severity: 'HIGH',
      });
    }

    // Action: Resume drafts
    const draftApps = applications.filter((a) => a.status === APPLICATION_STATUSES.DRAFT);
    draftApps.forEach((d) => {
      pendingActions.push({
        id: `ACTION_DRAFT_${d._id}`,
        title: `Resume Draft: ${d.schemeName}`,
        description: `Saved at step ${d.currentStep} of 5. Auto-saved on ${new Date(d.lastSavedAt).toLocaleDateString()}.`,
        actionUrl: `/apply/${d.schemeCode}/${d._id}`,
        actionLabel: 'Resume Application',
        severity: 'MEDIUM',
      });
    });

    // Action: Deficiencies raised
    const deficiencyApps = applications.filter((a) => a.status === APPLICATION_STATUSES.DEFICIENCY_RAISED);
    deficiencyApps.forEach((defApp) => {
      const openDef = defApp.deficiencies.filter((d) => d.status === 'OPEN');
      openDef.forEach((def) => {
        pendingActions.push({
          id: `ACTION_DEF_${def.deficiencyId}`,
          title: `Deficiency Raised on ${defApp.schemeName}`,
          description: `${def.field}: ${def.description} (Raised by ${def.raisedBy})`,
          actionUrl: `/apply/${defApp.schemeCode}/${defApp._id}`,
          actionLabel: 'Resolve Query',
          severity: 'HIGH',
        });
      });
    });

    // Payments Summary Calculation
    let dbtDisbursed = 0;
    let dbtPending = 0;
    let dbtRejected = 0;
    let paymentRecords = [];

    applications.forEach((a) => {
      if (a.dbtPayment) {
        if (a.dbtPayment.amountDisbursed) {
          dbtDisbursed += a.dbtPayment.amountDisbursed;
        }
        if (a.dbtPayment.amountSanctioned && !a.dbtPayment.amountDisbursed) {
          dbtPending += a.dbtPayment.amountSanctioned;
        }
        if (a.dbtPayment.paymentStatus === 'Rejected') {
          dbtRejected += a.dbtPayment.amountSanctioned || 0;
        }

        if (a.dbtPayment.paymentStatus) {
          paymentRecords.push({
            schemeName: a.schemeName,
            amount: a.dbtPayment.amountDisbursed || a.dbtPayment.amountSanctioned,
            status: a.dbtPayment.paymentStatus,
            transactionId: a.dbtPayment.pfmsTransactionId,
            date: a.dbtPayment.disbursedDate || a.updatedAt,
            rejectionReason: a.dbtPayment.rejectionReason,
          });
        }
      }
    });

    // Conflict status check
    const conflictCheck = checkScholarshipConflict(student, null);

    return res.status(200).json({
      success: true,
      schemeStatuses,
      activeApplication: activeApp || null,
      timeline,
      pendingActions,
      paymentsSummary: {
        totalDisbursed: dbtDisbursed,
        pendingDisbursement: dbtPending,
        failedDisbursement: dbtRejected,
        paymentRecords,
      },
      conflictStatus: conflictCheck,
    });
  } catch (err) {
    next(err);
  }
};

export const checkEligibility = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { schemeCode } = req.query;

    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(200).json({
        success: true,
        isProfileComplete: false,
        message: 'Please complete your student profile to run eligibility checks.',
        evaluations: [],
      });
    }

    if (schemeCode) {
      const scheme = await Scheme.findOne({ code: schemeCode.toUpperCase() });
      if (!scheme) {
        return res.status(404).json({ success: false, message: `Scheme '${schemeCode}' not found.` });
      }
      const evaluation = await evaluateStudentEligibility(student, scheme);
      return res.status(200).json({
        success: true,
        isProfileComplete: true,
        evaluation,
      });
    }

    const allSchemes = await Scheme.find({ isActive: true }).sort({ createdAt: 1 });
    const evaluations = await evaluateAllSchemesForStudent(student, allSchemes);

    return res.status(200).json({
      success: true,
      isProfileComplete: true,
      evaluations,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentApplications = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(200).json({ success: true, count: 0, applications: [] });
    }

    const applications = await Application.find({ studentId: student._id }).sort({ updatedAt: -1 });
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const application = await Application.findOne({
      _id: id,
      userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or unauthorized access.',
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (err) {
    next(err);
  }
};

export const saveApplicationDraft = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { schemeCode, currentStep, formData, applicationId } = req.body;

    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Profile not found. Please create your profile before starting an application.',
      });
    }

    const scheme = await Scheme.findOne({ code: schemeCode.toUpperCase() });
    if (!scheme) {
      return res.status(404).json({ success: false, message: `Scheme '${schemeCode}' not found.` });
    }

    // Check One-Scheme-at-a-time rule warning
    const conflict = checkScholarshipConflict(student, scheme.code);

    let application;
    if (applicationId) {
      application = await Application.findOne({ _id: applicationId, userId });
      if (!application) {
        return res.status(404).json({ success: false, message: 'Draft application not found.' });
      }
      if (application.status !== APPLICATION_STATUSES.DRAFT && application.status !== APPLICATION_STATUSES.DEFICIENCY_RAISED) {
        return res.status(400).json({
          success: false,
          message: `Cannot edit application in '${application.status}' status.`,
        });
      }

      application.currentStep = currentStep || application.currentStep;
      application.formData = { ...application.formData.toObject(), ...formData };
      application.lastSavedAt = new Date();
      await application.save();
    } else {
      // Create new draft
      const appNumber = `MOTA/${new Date().getFullYear()}/${scheme.code.slice(0, 3)}/${Math.floor(10000 + Math.random() * 90000)}`;

      application = await Application.create({
        applicationNumber: appNumber,
        studentId: student._id,
        userId,
        schemeCode: scheme.code,
        schemeName: scheme.name,
        academicYear: '2026-27',
        status: APPLICATION_STATUSES.DRAFT,
        currentStep: currentStep || 1,
        formData: formData || {},
        timeline: [
          {
            stage: 'Submission',
            status: 'Draft Saved',
            remarks: 'Application wizard initiated and draft auto-saved.',
            actor: 'Student',
            timestamp: new Date(),
          },
        ],
        lastSavedAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Draft application saved successfully.',
      application,
      conflictWarning: conflict.hasConflict ? conflict.message : null,
    });
  } catch (err) {
    next(err);
  }
};

export const submitApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { formData } = req.body;

    const student = await Student.findOne({ userId });
    const application = await Application.findOne({ _id: id, userId });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // STRICT ENFORCEMENT: One-Scholarship-at-a-time rule
    const conflict = checkScholarshipConflict(student, application.schemeCode);
    if (conflict.hasConflict) {
      return res.status(409).json({
        success: false,
        code: 'SCHOLARSHIP_CONFLICT',
        message: conflict.message,
        activeScholarship: conflict.activeScholarship,
      });
    }

    const scheme = await Scheme.findOne({ code: application.schemeCode });

    // Update formData if provided
    if (formData) {
      application.formData = { ...application.formData.toObject(), ...formData };
    }

    application.status = APPLICATION_STATUSES.SUBMITTED;
    application.submissionDate = new Date();
    application.currentStep = 5;

    // Timeline event
    application.timeline.push({
      stage: 'Submission',
      status: 'Submitted',
      remarks: 'Application submitted successfully via Unified Mobile Application.',
      actor: 'Student',
      timestamp: new Date(),
    });

    application.timeline.push({
      stage: 'Institute Verification',
      status: 'In Progress',
      remarks: `Forwarded to ${student.institutionName || 'Institution'} Nodal Officer for Bonafide and Document Scrutiny.`,
      actor: 'System Integration Layer',
      timestamp: new Date(),
    });

    // Configure External Portal Handoff / Deep-Link Reference
    application.externalHandoff = {
      portalName: scheme.portalName,
      portalUrl: scheme.portalUrl,
      externalApplicationId: `EXT-${application.applicationNumber}`,
      redirectedAt: new Date(),
      isDirectSubmission: true,
    };

    await application.save();

    // Update student's active scholarship tracker
    student.activeScholarship = {
      schemeCode: application.schemeCode,
      applicationId: application.applicationNumber,
      schemeName: application.schemeName,
      sanctionedYear: '2026-27',
      status: APPLICATION_STATUSES.SUBMITTED,
    };
    await student.save();

    await logAudit({
      action: 'APPLICATION_SUBMITTED',
      req,
      targetEntity: 'Application',
      targetId: application._id,
      metadata: {
        applicationNumber: application.applicationNumber,
        schemeCode: application.schemeCode,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Application ${application.applicationNumber} submitted successfully! Your application is now queued for Institute Verification.`,
      application,
      externalHandoff: application.externalHandoff,
    });
  } catch (err) {
    next(err);
  }
};

export const resolveDeficiency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { deficiencyId, studentResponse } = req.body;

    const application = await Application.findOne({ _id: id, userId });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const deficiency = application.deficiencies.find((d) => d.deficiencyId === deficiencyId);
    if (!deficiency) {
      return res.status(404).json({ success: false, message: 'Deficiency query not found.' });
    }

    deficiency.status = 'RESOLVED';
    deficiency.studentResponse = studentResponse;
    deficiency.resolvedAt = new Date();

    // If all deficiencies resolved, transition application back to UNDER_VERIFICATION
    const hasOpenDeficiencies = application.deficiencies.some((d) => d.status === 'OPEN');
    if (!hasOpenDeficiencies) {
      application.status = APPLICATION_STATUSES.UNDER_VERIFICATION;
      application.timeline.push({
        stage: 'Institute Verification',
        status: 'Deficiency Resolved',
        remarks: `Student addressed deficiency query (${deficiency.field}). Scrutiny resumed.`,
        actor: 'Student',
        timestamp: new Date(),
      });
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Deficiency response submitted successfully. Application returned to verification queue.',
      application,
    });
  } catch (err) {
    next(err);
  }
};
