import { JagoService, JAGO_KNOWLEDGE_BASE } from '../services/jagoService.js';
import { Student } from '../models/Student.js';
import { Application } from '../models/Application.js';
import { logAudit } from '../middlewares/auditMiddleware.js';

export const handleChatQuery = async (req, res, next) => {
  try {
    const { message, language = 'en' } = req.body;
    let student = null;

    if (req.user?.userId) {
      student = await Student.findOne({ userId: req.user.userId });
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query message cannot be empty.',
      });
    }

    const result = JagoService.processQuery(message, student, language);

    // Audit log conversation query
    if (req.user) {
      await logAudit({
        action: 'JAGO_AI_QUERY',
        req,
        targetEntity: 'JagoAssistant',
        metadata: { intent: result.intent, language, studentId: student?._id },
      });
    }

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const getSuggestedPrompts = async (req, res, next) => {
  try {
    let student = null;
    let applications = [];

    if (req.user?.userId) {
      student = await Student.findOne({ userId: req.user.userId });
      if (student) {
        applications = await Application.find({ studentId: student._id });
      }
    }

    const suggestions = [];

    if (!student) {
      suggestions.push(
        'What are the 5 MoTA scholarship schemes?',
        'How does the One-Scholarship-at-a-Time rule work?',
        'How to link bank account with NPCI for DBT?',
        'What documents do I need for Top Class scholarship?'
      );
    } else {
      // Tailored suggestions based on active status
      if (student.activeScholarship) {
        suggestions.push(
          `When will my ${student.activeScholarship.schemeCode} DBT installment be credited?`,
          'Can I apply for another scholarship while receiving this award?'
        );
      } else {
        suggestions.push(
          'Check which MoTA scholarship matches my profile',
          'How to pull my ST Caste Certificate from DigiLocker?'
        );
      }

      if (student.isPVTG) {
        suggestions.push('What special quota advantages are available for PVTG students?');
      }
      if (student.isDivyang) {
        suggestions.push('What additional book & reader allowances do Divyang ST students get?');
      }
    }

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (err) {
    next(err);
  }
};

export const getKnowledgeOverview = async (req, res) => {
  return res.status(200).json({
    success: true,
    knowledgeBase: JAGO_KNOWLEDGE_BASE,
  });
};
