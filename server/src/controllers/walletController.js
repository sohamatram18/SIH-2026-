import { Document } from '../models/Document.js';
import { Student } from '../models/Student.js';
import { Verification } from '../models/Verification.js';
import { verificationService } from '../services/verificationAdapters.js';
import { logAudit } from '../middlewares/auditMiddleware.js';

export const getWalletDocuments = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(200).json({ success: true, count: 0, documents: [] });
    }

    const documents = await Document.find({ studentId: student._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (err) {
    next(err);
  }
};

export const fetchFromDigiLocker = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(400).json({ success: false, message: 'Student profile not found.' });
    }

    const digiLockerAdapter = verificationService.adapters.DIGILOCKER;
    const issuedDocs = await digiLockerAdapter.fetchDocuments(student.apaarId || student.aadhaarDetails?.aadhaarLast4);

    const savedDocs = [];
    for (const docData of issuedDocs) {
      let doc = await Document.findOne({ studentId: student._id, docType: docData.docType });
      if (!doc) {
        doc = await Document.create({
          studentId: student._id,
          userId,
          docType: docData.docType,
          title: docData.title,
          documentNumber: docData.documentNumber,
          issuingAuthority: docData.issuingAuthority,
          issuedDate: docData.issuedDate,
          validUntil: docData.validUntil,
          source: 'DIGILOCKER',
          fileSize: docData.fileSize,
          mimeType: 'application/pdf',
          verificationStatus: 'VERIFIED',
          verificationSource: 'DigiLocker Certified PKI',
          verifiedAt: new Date(),
        });
      } else {
        doc.verificationStatus = 'VERIFIED';
        doc.verificationSource = 'DigiLocker Certified PKI';
        doc.verifiedAt = new Date();
        await doc.save();
      }

      // Record Verification audit log
      await Verification.create({
        documentId: doc._id,
        studentId: student._id,
        adapterName: 'DigiLockerAdapter',
        verificationType: `${docData.docType}_DIGILOCKER_PULL`,
        status: 'MATCH',
        confidenceScore: 100,
        sourcePayloadSummary: {
          issuer: docData.issuingAuthority,
          documentNumber: docData.documentNumber,
          digitalSignatureVerified: true,
        },
        reviewedBy: 'DigiLocker OAuth Gateway',
        reviewerRole: 'system',
      });

      savedDocs.push(doc);
    }

    await logAudit({
      action: 'DIGILOCKER_DOCUMENTS_PULLED',
      req,
      targetEntity: 'Document',
      metadata: { count: savedDocs.length },
    });

    return res.status(200).json({
      success: true,
      message: `Successfully fetched and verified ${savedDocs.length} certificates from DigiLocker.`,
      documents: savedDocs,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { docType, title, documentNumber, issuingAuthority, fileSize, mimeType } = req.body;

    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(400).json({ success: false, message: 'Student profile required.' });
    }

    const newDoc = await Document.create({
      studentId: student._id,
      userId,
      docType,
      title: title || `${docType.replace(/_/g, ' ')}`,
      documentNumber: documentNumber || `DOC-${Date.now().toString().slice(-6)}`,
      issuingAuthority: issuingAuthority || 'Designated Authority',
      source: 'UPLOAD',
      fileSize: fileSize || '380 KB',
      mimeType: mimeType || 'application/pdf',
      verificationStatus: 'PENDING',
    });

    // Run non-blocking verification adapter
    const verificationResult = await verificationService.verifyDocument(newDoc, student);

    await logAudit({
      action: 'DOCUMENT_UPLOADED',
      req,
      targetEntity: 'Document',
      targetId: newDoc._id,
      metadata: { docType, verificationStatus: newDoc.verificationStatus },
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and passed through automated verification pipeline.',
      document: newDoc,
      verification: verificationResult,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyDocumentOnDemand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const student = await Student.findOne({ userId });
    const document = await Document.findOne({ _id: id });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    const result = await verificationService.verifyDocument(document, student);

    return res.status(200).json({
      success: true,
      message: 'On-demand verification completed.',
      document,
      result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Nodal Officer / Admin Review Queue
 */
export const getManualReviewQueue = async (req, res, next) => {
  try {
    const reviewItems = await Verification.find({
      status: { $in: ['NEEDS_MANUAL_REVIEW', 'MISMATCH', 'SOURCE_TIMEOUT'] },
    })
      .populate('studentId', 'name tribe state district courseLevel institutionName')
      .populate('documentId', 'title docType documentNumber issuingAuthority')
      .sort({ timestamp: -1 });

    return res.status(200).json({
      success: true,
      count: reviewItems.length,
      reviewQueue: reviewItems,
    });
  } catch (err) {
    next(err);
  }
};

export const resolveManualReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, remarks } = req.body; // 'APPROVED' | 'REJECTED'

    const verRecord = await Verification.findById(id);
    if (!verRecord) {
      return res.status(404).json({ success: false, message: 'Review queue item not found.' });
    }

    verRecord.status = decision === 'APPROVED' ? 'MANUAL_OVERRIDE_APPROVED' : 'MANUAL_OVERRIDE_REJECTED';
    verRecord.reviewedBy = req.user.name || req.user.phone;
    verRecord.reviewerRole = req.user.role;
    verRecord.reviewRemarks = remarks;
    await verRecord.save();

    if (verRecord.documentId) {
      const doc = await Document.findById(verRecord.documentId);
      if (doc) {
        doc.verificationStatus = decision === 'APPROVED' ? 'VERIFIED' : 'REJECTED';
        doc.verificationSource = `Officer Manual Review (${req.user.name || 'Nodal Officer'})`;
        doc.verifiedAt = new Date();
        await doc.save();
      }
    }

    await logAudit({
      action: 'MANUAL_REVIEW_RESOLVED',
      req,
      targetEntity: 'Verification',
      targetId: verRecord._id,
      metadata: { decision, remarks },
    });

    return res.status(200).json({
      success: true,
      message: `Document verification ${decision === 'APPROVED' ? 'Approved' : 'Rejected'} by officer.`,
      verification: verRecord,
    });
  } catch (err) {
    next(err);
  }
};
