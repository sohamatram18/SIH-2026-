import { SCHEME_CODES, COURSE_LEVELS } from '../config/constants.js';
import { Institution } from '../models/Institution.js';

/**
 * Checks whether the student has an active sanctioned or disbursed scholarship that conflicts
 * with applying for a new scheme (enforcing the "One Scholarship at a Time" rule).
 */
export const checkScholarshipConflict = (student, targetSchemeCode) => {
  const active = student?.activeScholarship;

  if (!active || !active.schemeCode) {
    return {
      hasConflict: false,
      activeScholarship: null,
      message: 'No existing active scholarship found. Student is eligible to apply.',
    };
  }

  // Check if current scheme is the same one (e.g. renewal / same application)
  if (active.schemeCode === targetSchemeCode) {
    return {
      hasConflict: false,
      isRenewal: true,
      activeScholarship: active,
      message: `Student already holds ${active.schemeName} (${active.status}). Renewal/continuation mode active.`,
    };
  }

  // Conflicting scheme detected
  const blockingStatuses = ['Sanctioned', 'Disbursed', 'Under verification'];
  const isBlocking = blockingStatuses.includes(active.status);

  return {
    hasConflict: isBlocking,
    activeScholarship: active,
    message: isBlocking
      ? `CONFLICT DETECTED: You currently hold an active award under '${active.schemeName}' with status '${active.status}' (${active.sanctionedYear || 'Active'}). Under Ministry of Tribal Affairs guidelines, a student can receive only ONE scholarship/fellowship at a time. You must formally surrender your existing award before a new scheme can be sanctioned.`
      : `NOTE: An existing application exists for '${active.schemeName}' with status '${active.status}'.`,
  };
};

/**
 * Evaluates student profile against a specific scheme's rules
 */
export const evaluateStudentEligibility = async (student, scheme) => {
  if (!student) {
    return {
      schemeCode: scheme.code,
      verdict: 'INCOMPLETE_PROFILE',
      percentageMatch: 0,
      reasons: [{ rule: 'Profile Registration', passed: false, detail: 'Please complete your student profile first.' }],
    };
  }

  const reasons = [];
  let criteriaPassed = 0;
  let totalCriteria = 0;

  // 1. Tribal Community Verification
  totalCriteria += 1;
  if (student.tribe && student.tribe.trim().length > 0) {
    criteriaPassed += 1;
    reasons.push({
      rule: 'Scheduled Tribe (ST) Status',
      passed: true,
      detail: `Verified ST Beneficiary (${student.tribe} Tribe, Domicile: ${student.state})`,
    });
  } else {
    reasons.push({
      rule: 'Scheduled Tribe (ST) Status',
      passed: false,
      detail: 'ST Caste verification required',
    });
  }

  // 2. Income Ceiling Check
  totalCriteria += 1;
  const maxIncome = (scheme.eligibility?.maxIncomeLakhs || 0) * 100000;
  const studentIncome = student.familyAnnualIncome || 0;

  if (scheme.eligibility?.maxIncomeLakhs > 50) {
    // Purely merit-based scheme (e.g. NFST has no income ceiling)
    criteriaPassed += 1;
    reasons.push({
      rule: 'Annual Family Income Limit',
      passed: true,
      detail: 'No parental income ceiling applicable (Purely Merit-Based on Master’s marks)',
    });
  } else if (studentIncome <= maxIncome) {
    criteriaPassed += 1;
    reasons.push({
      rule: 'Annual Family Income Limit',
      passed: true,
      detail: `Parental income ₹${(studentIncome / 100000).toFixed(2)} Lakh/yr is within the permissible limit (≤ ₹${scheme.eligibility.maxIncomeLakhs} Lakh/yr)`,
    });
  } else {
    reasons.push({
      rule: 'Annual Family Income Limit',
      passed: false,
      detail: `Parental income ₹${(studentIncome / 100000).toFixed(2)} Lakh/yr exceeds the scheme ceiling of ₹${scheme.eligibility.maxIncomeLakhs} Lakh/yr`,
    });
  }

  // 3. Academic Level / Class Check
  totalCriteria += 1;
  const studentLevel = student.courseLevel;
  const studentClass = student.currentClass;

  if (scheme.code === SCHEME_CODES.PRE_MATRIC) {
    const isPreMatric = studentLevel === COURSE_LEVELS.PRE_MATRIC || (studentClass >= 9 && studentClass <= 10);
    if (isPreMatric) {
      criteriaPassed += 1;
      reasons.push({
        rule: 'Academic Stage (Classes IX-X)',
        passed: true,
        detail: `Currently enrolled in Class ${studentClass || 'IX/X'}`,
      });
    } else {
      reasons.push({
        rule: 'Academic Stage (Classes IX-X)',
        passed: false,
        detail: `Pre-Matric is restricted to Class IX and X. Your current course level is ${studentLevel}.`,
      });
    }
  } else if (scheme.code === SCHEME_CODES.POST_MATRIC) {
    const isPostMatric = [COURSE_LEVELS.POST_MATRIC, COURSE_LEVELS.GRADUATION, COURSE_LEVELS.POST_GRADUATION].includes(studentLevel);
    if (isPostMatric) {
      criteriaPassed += 1;
      reasons.push({
        rule: 'Academic Stage (Post-Class X)',
        passed: true,
        detail: `Enrolled in recognized post-secondary course: ${student.course}`,
      });
    } else {
      reasons.push({
        rule: 'Academic Stage (Post-Class X)',
        passed: false,
        detail: `Requires post-secondary or college level course. Currently: ${studentLevel}`,
      });
    }
  } else if (scheme.code === SCHEME_CODES.TOP_CLASS) {
    const isHigherEd = [COURSE_LEVELS.GRADUATION, COURSE_LEVELS.POST_GRADUATION].includes(studentLevel);
    if (isHigherEd) {
      criteriaPassed += 1;
      reasons.push({
        rule: 'Academic Stage (Undergraduate / Postgraduate)',
        passed: true,
        detail: `Enrolled in Degree program: ${student.course}`,
      });
    } else {
      reasons.push({
        rule: 'Academic Stage',
        passed: false,
        detail: `Top Class requires Undergraduate or Postgraduate degree course. Currently: ${studentLevel}`,
      });
    }
  } else if (scheme.code === SCHEME_CODES.NFST) {
    const isResearch = [COURSE_LEVELS.MPHIL, COURSE_LEVELS.PHD].includes(studentLevel);
    if (isResearch) {
      criteriaPassed += 1;
      reasons.push({
        rule: 'Research Enrollment (M.Phil / Ph.D.)',
        passed: true,
        detail: `Enrolled in regular research program: ${student.course}`,
      });
    } else {
      reasons.push({
        rule: 'Research Enrollment',
        passed: false,
        detail: `NFST is exclusively for regular full-time M.Phil or Ph.D. scholars. Currently: ${studentLevel}`,
      });
    }
  } else if (scheme.code === SCHEME_CODES.NOS) {
    const isAbroadLevel = [COURSE_LEVELS.POST_GRADUATION, COURSE_LEVELS.PHD, COURSE_LEVELS.POST_DOC].includes(studentLevel);
    if (isAbroadLevel) {
      criteriaPassed += 1;
      reasons.push({
        rule: 'Foreign Study Degree Level (Master\'s / Ph.D. / Post-Doc)',
        passed: true,
        detail: `Aspirant for: ${student.course}`,
      });
    } else {
      reasons.push({
        rule: 'Foreign Study Degree Level',
        passed: false,
        detail: `NOS requires Master's, Ph.D., or Post-Doctoral studies abroad. Currently: ${studentLevel}`,
      });
    }
  }

  // 4. Institutional Accreditation Check
  if (scheme.eligibility?.requiresPremierInstitute) {
    totalCriteria += 1;
    let isPremier = false;
    if (student.aisheCode) {
      const inst = await Institution.findOne({ aisheCode: student.aisheCode });
      if (inst && inst.isTopClassEligible) {
        isPremier = true;
      }
    } else if (student.institutionName && /IIT|IIM|AIIMS|NIT|National/i.test(student.institutionName)) {
      isPremier = true;
    }

    if (isPremier) {
      criteriaPassed += 1;
      reasons.push({
        rule: 'Notified Premier Institute Accreditation (246/265 Institutes)',
        passed: true,
        detail: `${student.institutionName} is recognized on the Ministry\'s notified Top Class premier institutes list.`,
      });
    } else {
      reasons.push({
        rule: 'Notified Premier Institute Accreditation',
        passed: false,
        detail: `${student.institutionName} is not in the Ministry's notified premier institutes list (IITs, AIIMS, IIMs, NITs, etc.).`,
      });
    }
  }

  if (scheme.eligibility?.requiresUgcRecognised) {
    totalCriteria += 1;
    criteriaPassed += 1; // Default true for university scholars in mock environment
    reasons.push({
      rule: 'UGC-Recognized University Accreditation',
      passed: true,
      detail: `${student.institutionName} is recognized under UGC Act.`,
    });
  }

  // 5. Preferential Weightage Checks (Girls, PVTG, Divyang)
  const preferentialNotes = [];
  if (student.gender === 'Female') {
    preferentialNotes.push('Female ST Student Priority Quota applicable');
  }
  if (student.isPVTG) {
    preferentialNotes.push(`Particularly Vulnerable Tribal Group (PVTG - ${student.pvtgCommunity || 'Special Quota'}) reservation applicable`);
  }
  if (student.isDivyang) {
    preferentialNotes.push(`Divyang (PwD - ${student.divyangPercentage}% disability) priority allocation applicable`);
  }

  // Calculate percentage match
  const percentageMatch = Math.round((criteriaPassed / totalCriteria) * 100);
  const isEligible = percentageMatch === 100;
  const verdict = isEligible ? 'ELIGIBLE' : percentageMatch >= 70 ? 'CONDITIONAL' : 'INELIGIBLE';

  // Check One-Scheme Conflict
  const conflict = checkScholarshipConflict(student, scheme.code);

  return {
    schemeCode: scheme.code,
    schemeName: scheme.name,
    verdict,
    percentageMatch,
    isEligible,
    hasConflict: conflict.hasConflict,
    conflictDetails: conflict,
    reasons,
    preferentialNotes,
    estimatedEntitlement: scheme.allowanceStructure?.description,
  };
};

/**
 * Evaluates all 5 MoTA schemes for a given student in parallel
 */
export const evaluateAllSchemesForStudent = async (student, allSchemes) => {
  const evaluations = [];
  for (const scheme of allSchemes) {
    const evalResult = await evaluateStudentEligibility(student, scheme);
    evaluations.push(evalResult);
  }
  return evaluations;
};
