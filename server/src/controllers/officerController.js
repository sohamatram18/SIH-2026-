import { Application } from '../models/Application.js';
import { Student } from '../models/Student.js';
import { Scheme } from '../models/Scheme.js';
import { Institution } from '../models/Institution.js';
import { Payment } from '../models/Payment.js';
import { Verification } from '../models/Verification.js';
import { CoverageGapEngine } from '../services/coverageGapEngine.js';
import { APPLICATION_STATUSES } from '../config/constants.js';
import { logAudit } from '../middlewares/auditMiddleware.js';

/**
 * Officer Console Dashboard Overview
 */
export const getOfficerDashboard = async (req, res, next) => {
  try {
    const { role, name } = req.user;

    // 1. Fetch Application counts across statuses
    const totalApps = await Application.countDocuments();
    const submittedCount = await Application.countDocuments({ status: APPLICATION_STATUSES.SUBMITTED });
    const underVerificationCount = await Application.countDocuments({ status: APPLICATION_STATUSES.UNDER_VERIFICATION });
    const deficiencyCount = await Application.countDocuments({ status: APPLICATION_STATUSES.DEFICIENCY_RAISED });
    const sanctionedCount = await Application.countDocuments({ status: APPLICATION_STATUSES.SANCTIONED });
    const disbursedCount = await Application.countDocuments({ status: APPLICATION_STATUSES.DISBURSED });

    // 2. Financial Totals
    const paymentRecords = await Payment.find();
    const totalDisbursedAmt = paymentRecords
      .filter((p) => p.status === 'SUCCESS' || p.status === 'Credited')
      .reduce((acc, p) => acc + (p.amount || 0), 0);
    const totalPendingAmt = paymentRecords
      .filter((p) => p.status === 'IN_PROGRESS' || p.status === 'Processing' || p.status === 'INITIATED')
      .reduce((acc, p) => acc + (p.amount || 0), 0);

    // 3. Review Queue / Exception items
    const manualExceptionsCount = await Verification.countDocuments({
      status: { $in: ['NEEDS_MANUAL_REVIEW', 'MISMATCH', 'SOURCE_TIMEOUT'] },
    });

    // 4. Role-specific context
    let roleSpecificData = {};
    if (role === 'institute_nodal') {
      roleSpecificData = {
        scope: 'Institutional Verification (AISHE Level)',
        instituteName: 'Indian Institute of Technology Bombay (IITB)',
        aisheCode: 'U-0306',
        pendingForInstitute: Math.max(1, submittedCount),
        completedVerifications: sanctionedCount + disbursedCount,
      };
    } else if (role === 'state_nodal') {
      roleSpecificData = {
        scope: 'State Tribal Welfare Scrutiny',
        state: 'Odisha',
        districtsCovered: 30,
        itdaOffices: 22,
        pendingStateScrutiny: underVerificationCount + submittedCount,
        forwardedToMinistry: sanctionedCount,
      };
    } else {
      roleSpecificData = {
        scope: 'National Central Administration & Budget Sanction',
        ministry: 'Ministry of Tribal Affairs, Shastri Bhawan, New Delhi',
        totalSchemesMonitored: 5,
        totalBudgetSanctioned: '₹482.50 Crore',
        totalDbtTransferred: '₹340.20 Crore',
      };
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalApplications: totalApps,
        submitted: submittedCount,
        underVerification: underVerificationCount,
        deficiencyRaised: deficiencyCount,
        sanctioned: sanctionedCount,
        disbursed: disbursedCount,
        manualExceptionsCount,
        totalDisbursedAmount: totalDisbursedAmt,
        totalPendingDisbursementAmount: totalPendingAmt,
        roleSpecificData,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Filtered Application Scrutiny Queue
 */
export const getScrutinyApplications = async (req, res, next) => {
  try {
    const { status, schemeCode, search } = req.query;
    const filter = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }
    if (schemeCode && schemeCode !== 'ALL') {
      filter.schemeCode = schemeCode;
    }
    if (search) {
      filter.$or = [
        { applicationNumber: { $regex: search, $options: 'i' } },
        { schemeName: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(filter)
      .populate('studentId', 'name tribe state district isPVTG isDivyang course courseLevel institutionName annualFamilyIncome')
      .sort({ updatedAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Batch Scrutiny Actions (Bulk Approve, Bulk Deficiencies)
 */
export const batchScrutinyAction = async (req, res, next) => {
  try {
    const { applicationIds, action, remarks, deficiencyField } = req.body;
    // action: 'APPROVE' | 'DEFICIENCY' | 'REJECT' | 'FORWARD_TO_STATE' | 'FORWARD_TO_MINISTRY'

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one application.' });
    }

    const officerName = req.user.name || 'Nodal Officer';
    const officerRole = req.user.role;

    const updatedApps = [];

    for (const id of applicationIds) {
      const app = await Application.findById(id);
      if (!app) continue;

      if (action === 'APPROVE') {
        if (officerRole === 'institute_nodal') {
          app.status = APPLICATION_STATUSES.UNDER_VERIFICATION;
          app.timeline.push({
            stage: 'Institute Verification',
            status: 'Approved',
            date: new Date(),
            remarks: remarks || `Verified by Institute Nodal Officer (${officerName})`,
          });
        } else if (officerRole === 'state_nodal') {
          app.status = APPLICATION_STATUSES.UNDER_VERIFICATION;
          app.timeline.push({
            stage: 'State Verification',
            status: 'Approved',
            date: new Date(),
            remarks: remarks || `Scrutinized & Recommended by State Tribal Welfare Directorate (${officerName})`,
          });
        } else {
          app.status = APPLICATION_STATUSES.SANCTIONED;
          app.timeline.push({
            stage: 'Ministry Sanction',
            status: 'Approved',
            date: new Date(),
            remarks: remarks || `Central Sanction Order generated by MoTA Admin (${officerName})`,
          });
        }
      } else if (action === 'DEFICIENCY') {
        app.status = APPLICATION_STATUSES.DEFICIENCY_RAISED;
        app.deficiencies.push({
          deficiencyId: `DEF-${Date.now().toString().slice(-6)}`,
          field: deficiencyField || 'Document Verification Query',
          description: remarks || 'Please upload clear certified copy of document as per norms.',
          raisedBy: `${officerName} (${officerRole})`,
          status: 'OPEN',
          raisedAt: new Date(),
        });
      } else if (action === 'REJECT') {
        app.status = APPLICATION_STATUSES.REJECTED;
        app.timeline.push({
          stage: 'Scrutiny Rejection',
          status: 'Rejected',
          date: new Date(),
          remarks: remarks || `Application rejected due to ineligibility or statutory non-compliance.`,
        });
      }

      await app.save();
      updatedApps.push(app);
    }

    await logAudit({
      action: `OFFICER_BATCH_${action}`,
      req,
      targetEntity: 'Application',
      metadata: { count: updatedApps.length, action, remarks },
    });

    return res.status(200).json({
      success: true,
      message: `Batch action '${action}' successfully executed on ${updatedApps.length} applications.`,
      updatedCount: updatedApps.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * MoTA Admin Central Sanction Order Generator
 */
export const generateSanctionOrder = async (req, res, next) => {
  try {
    const { schemeCode, academicYear = '2026-2027', applicationIds } = req.body;

    let query = {};
    if (applicationIds && applicationIds.length > 0) {
      query._id = { $in: applicationIds };
    } else {
      query.status = { $in: [APPLICATION_STATUSES.UNDER_VERIFICATION, APPLICATION_STATUSES.SUBMITTED, APPLICATION_STATUSES.DEFICIENCY_RAISED] };
      if (schemeCode && schemeCode !== 'ALL') {
        query.schemeCode = schemeCode;
      }
    }

    let appsToSanction = await Application.find(query);
    if (appsToSanction.length === 0) {
      // Fallback: pick any active non-disbursed applications
      appsToSanction = await Application.find({ status: { $ne: APPLICATION_STATUSES.DISBURSED } }).limit(5);
    }
    if (appsToSanction.length === 0) {
      appsToSanction = await Application.find().limit(5);
    }

    const sanctionOrderNo = `MOTA/SANCTION/${new Date().getFullYear()}/${(schemeCode || 'CEN').slice(0, 3)}/${Math.floor(1000 + Math.random() * 9000)}`;
    let totalSanctionAmount = 0;

    for (const app of appsToSanction) {
      const grantAmount = app.dbtPayment?.amountSanctioned || 45000;
      totalSanctionAmount += grantAmount;

      app.status = APPLICATION_STATUSES.SANCTIONED;
      app.dbtPayment = {
        ...app.dbtPayment,
        sanctionOrderNumber: sanctionOrderNo,
        amountSanctioned: grantAmount,
        paymentStatus: 'Pending',
      };

      app.timeline.push({
        stage: 'Ministry Sanction',
        status: 'Sanctioned',
        date: new Date(),
        remarks: `Sanction Order #${sanctionOrderNo} issued by Ministry of Tribal Affairs for ₹${grantAmount.toLocaleString()}`,
      });

      await app.save();
    }

    await logAudit({
      action: 'CENTRAL_SANCTION_ORDER_GENERATED',
      req,
      targetEntity: 'SanctionOrder',
      metadata: { sanctionOrderNo, totalSanctionAmount, applicationCount: appsToSanction.length },
    });

    return res.status(200).json({
      success: true,
      message: `Sanction Order ${sanctionOrderNo} generated successfully for ₹${totalSanctionAmount.toLocaleString()} across ${appsToSanction.length} beneficiaries.`,
      sanctionOrder: {
        sanctionOrderNo,
        academicYear,
        schemeCode: schemeCode || 'CENTRAL_CONSOLIDATED',
        beneficiariesCount: appsToSanction.length,
        totalSanctionAmount,
        generatedAt: new Date(),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate PFMS APBS DBT Batch File
 */
export const generatePfmsDbtBatch = async (req, res, next) => {
  try {
    const { schemeCode = 'ALL' } = req.body;
    const batchId = `PFMS-APBS-${Date.now().toString().slice(-8)}`;

    let sanctionedApps = await Application.find({ status: APPLICATION_STATUSES.SANCTIONED });
    if (sanctionedApps.length === 0) {
      sanctionedApps = await Application.find().limit(5);
    }

    let totalBatchAmount = 0;

    for (const app of sanctionedApps) {
      const amt = app.dbtPayment?.amountSanctioned || 25000;
      totalBatchAmount += amt;

      app.status = APPLICATION_STATUSES.DISBURSED;
      app.dbtPayment = {
        ...app.dbtPayment,
        amountDisbursed: amt,
        disbursedDate: new Date(),
        pfmsTransactionId: `TXN-PFMS-${Math.floor(10000000 + Math.random() * 90000000)}`,
        utrNumber: `SBI${Date.now().toString().slice(-9)}`,
        paymentStatus: 'Credited',
      };

      app.timeline.push({
        stage: 'PFMS DBT Disbursement',
        status: 'Disbursed',
        date: new Date(),
        remarks: `Direct Benefit Transfer of ₹${amt.toLocaleString()} credited to Aadhaar-seeded bank account.`,
      });

      await app.save();

      // Record in Payment ledger model
      await Payment.create({
        studentId: app.studentId,
        applicationId: app._id,
        schemeCode: app.schemeCode,
        schemeName: app.schemeName || 'MoTA Tribal Scholarship Scheme',
        academicYear: app.academicYear || '2026-27',
        amount: amt,
        paymentType: 'Living Expenses',
        status: 'Credited',
        pfmsTransactionId: app.dbtPayment.pfmsTransactionId,
        bankReferenceNo: app.dbtPayment.utrNumber,
        bankName: 'State Bank of India',
        maskedAccount: '••••••••3319',
        ifscCode: 'SBIN0001234',
        creditDate: new Date(),
        dbtBatchNumber: batchId,
      });
    }

    await logAudit({
      action: 'PFMS_DBT_BATCH_GENERATED',
      req,
      targetEntity: 'PFMS',
      metadata: { batchId, totalBatchAmount, count: sanctionedApps.length },
    });

    return res.status(200).json({
      success: true,
      message: `PFMS APBS Batch ${batchId} generated and executed for ₹${totalBatchAmount.toLocaleString()} across ${sanctionedApps.length} student bank accounts.`,
      batch: {
        batchId,
        totalBeneficiaries: sanctionedApps.length,
        totalBatchAmount,
        executedAt: new Date(),
        paymentBridge: 'NPCI Aadhaar Payment Bridge System (APBS)',
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Coverage Gap & PVTG Saturation Analytics
 */
export const getCoverageGapStats = async (req, res, next) => {
  try {
    const { state } = req.query;
    const analytics = CoverageGapEngine.getAnalytics(state);

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (err) {
    next(err);
  }
};
