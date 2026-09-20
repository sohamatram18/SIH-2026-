import { Scheme } from '../models/Scheme.js';
import { Institution } from '../models/Institution.js';
import { logAudit } from '../middlewares/auditMiddleware.js';
import { ROLES } from '../config/constants.js';

export const getAllSchemes = async (req, res, next) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (err) {
    next(err);
  }
};

export const getSchemeByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const scheme = await Scheme.findOne({ code: code.toUpperCase() });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: `Scheme with code '${code}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      scheme,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSchemeConfig = async (req, res, next) => {
  try {
    const { code } = req.params;
    const updates = req.body;

    const scheme = await Scheme.findOne({ code: code.toUpperCase() });
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: `Scheme with code '${code}' not found.`,
      });
    }

    // Increment version and record updater
    scheme.version += 1;
    scheme.lastModifiedBy = req.user ? req.user.name || req.user.phone : 'MoTA Admin';
    
    // Deep update allowable config fields
    if (updates.eligibility) {
      scheme.eligibility = { ...scheme.eligibility.toObject(), ...updates.eligibility };
    }
    if (updates.allowanceStructure) {
      scheme.allowanceStructure = { ...scheme.allowanceStructure.toObject(), ...updates.allowanceStructure };
    }
    if (updates.description) scheme.description = updates.description;
    if (updates.fundingSplitInfo) scheme.fundingSplitInfo = updates.fundingSplitInfo;
    if (updates.documentsRequired) scheme.documentsRequired = updates.documentsRequired;
    if (updates.grievanceContact) {
      scheme.grievanceContact = { ...scheme.grievanceContact.toObject(), ...updates.grievanceContact };
    }

    await scheme.save();

    await logAudit({
      action: 'SCHEME_CONFIG_UPDATED',
      req,
      targetEntity: 'Scheme',
      targetId: scheme._id,
      metadata: { code: scheme.code, version: scheme.version },
    });

    return res.status(200).json({
      success: true,
      message: `Scheme ${scheme.name} config updated successfully to version ${scheme.version}.`,
      scheme,
    });
  } catch (err) {
    next(err);
  }
};

export const getInstitutions = async (req, res, next) => {
  try {
    const { search, state, topClassOnly, ugcOnly } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { aisheCode: { $regex: search, $options: 'i' } },
      ];
    }
    if (state) {
      filter.state = state;
    }
    if (topClassOnly === 'true') {
      filter.isTopClassEligible = true;
    }
    if (ugcOnly === 'true') {
      filter.isUgcRecognised = true;
    }

    const institutions = await Institution.find(filter).limit(100).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: institutions.length,
      institutions,
    });
  } catch (err) {
    next(err);
  }
};
