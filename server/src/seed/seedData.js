import mongoose from 'mongoose';
import pino from 'pino';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Scheme } from '../models/Scheme.js';
import { Institution } from '../models/Institution.js';
import { Application } from '../models/Application.js';
import { Document } from '../models/Document.js';
import { Payment } from '../models/Payment.js';
import { Notification } from '../models/Notification.js';
import { Grievance } from '../models/Grievance.js';
import { ROLES, SCHEME_CODES, COURSE_LEVELS, APPLICATION_STATUSES } from '../config/constants.js';
import { generateAadhaarToken, encrypt } from '../services/encryptionService.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export const seedDatabase = async () => {
  logger.info('🌱 Starting database seeding with official MoTA scheme rules and demo accounts...');

  // 1. Seed All 5 MoTA Schemes
  const schemesData = [
    {
      code: SCHEME_CODES.PRE_MATRIC,
      name: 'Pre-Matric Scholarship for ST Students (Classes IX & X)',
      shortName: 'Pre-Matric ST',
      category: 'Centrally Sponsored',
      portalUrl: 'https://dbttribal.gov.in',
      portalName: 'DBT Tribal Portal (dbttribal.gov.in)',
      fundingSplitInfo: '75:25 Centre:State (90:10 for NE/Special Category States; 100% for UTs without legislature)',
      description: 'Supports Scheduled Tribe students studying in classes IX and X to minimize dropouts and improve transition to secondary education.',
      eligibility: {
        minIncomeLakhs: 0,
        maxIncomeLakhs: 2.5,
        classRange: { minClass: 9, maxClass: 10 },
        allowedCourseLevels: [COURSE_LEVELS.PRE_MATRIC],
        requiresPremierInstitute: false,
        requiresUgcRecognised: false,
        requiresForeignAdmission: false,
        meritCriteria: 'Enrolled in recognized Class IX or X school',
        preferences: ['Full coverage of eligible ST students with verified parental income <= Rs 2.5 Lakh/yr'],
      },
      allowanceStructure: {
        description: 'Monthly maintenance allowance for 10 months per academic year plus book/contingency grants.',
        components: [
          {
            title: 'Day Scholar Allowance',
            amount: '₹225 / month',
            frequency: '10 months/year (₹2,250/yr)',
            notes: 'For students attending regular day school',
          },
          {
            title: 'Hosteller Allowance',
            amount: '₹525 / month',
            frequency: '10 months/year (₹5,250/yr)',
            notes: 'For students residing in recognized school hostels',
          },
        ],
      },
      dbtProvider: 'PFMS (Public Financial Management System)',
      grievanceContact: {
        portal: 'https://tribal.nic.in/Grievance',
        email: 'edu-tribal@nic.in',
        helpline: '1800-11-7777',
      },
      documentsRequired: [
        { docType: 'ST_CERTIFICATE', name: 'ST Caste Certificate', isMandatory: true, description: 'Competent Authority issued ST certificate' },
        { docType: 'INCOME_CERTIFICATE', name: 'Income Certificate', isMandatory: true, description: 'Annual family income <= Rs 2.5 Lakh' },
        { docType: 'PREVIOUS_MARKSHEET', name: 'Class VIII Marksheet/Pass Certificate', isMandatory: true, description: 'Proof of passing previous class' },
        { docType: 'BANK_PASSBOOK', name: 'Bank Passbook / Aadhaar-seeded account', isMandatory: true, description: 'Active bank account for DBT' },
      ],
    },
    {
      code: SCHEME_CODES.POST_MATRIC,
      name: 'Post-Matric Scholarship for ST Students',
      shortName: 'Post-Matric ST',
      category: 'Centrally Sponsored',
      portalUrl: 'https://dbttribal.gov.in',
      portalName: 'DBT Tribal Portal (dbttribal.gov.in)',
      fundingSplitInfo: '75:25 Centre:State (90:10 for NE/Special Category States; 100% for UTs without legislature)',
      description: 'Provides financial assistance to ST students studying post-matriculation or post-secondary stages to enable them to complete education.',
      eligibility: {
        minIncomeLakhs: 0,
        maxIncomeLakhs: 2.5,
        allowedCourseLevels: [
          COURSE_LEVELS.POST_MATRIC,
          COURSE_LEVELS.GRADUATION,
          COURSE_LEVELS.POST_GRADUATION,
        ],
        requiresPremierInstitute: false,
        requiresUgcRecognised: false,
        requiresForeignAdmission: false,
        meritCriteria: 'Admitted in any recognized post-secondary diploma, degree, or professional program',
        preferences: ['Full coverage of eligible ST students with verified parental income <= Rs 2.5 Lakh/yr'],
      },
      allowanceStructure: {
        description: 'Two components: Compulsory non-refundable fees (state-capped) + Group-wise maintenance allowance.',
        components: [
          {
            title: 'Compulsory Course Fees',
            amount: 'Actual fees (State-capped)',
            frequency: 'Annual',
            notes: 'Tuition fees, enrollment fees, exam fees',
          },
          {
            title: 'Maintenance Allowance (Group I to IV)',
            amount: '₹230 to ₹1,200 / month',
            frequency: '10 to 12 months/year',
            notes: 'Determined by course group (Professional Degree vs General Arts/Science/Commerce)',
          },
        ],
      },
      dbtProvider: 'PFMS (Public Financial Management System)',
      grievanceContact: {
        portal: 'https://tribal.nic.in/Grievance',
        email: 'edu-tribal@nic.in',
        helpline: '1800-11-7777',
      },
      documentsRequired: [
        { docType: 'ST_CERTIFICATE', name: 'ST Caste Certificate', isMandatory: true, description: 'Valid ST certificate' },
        { docType: 'INCOME_CERTIFICATE', name: 'Income Certificate', isMandatory: true, description: 'Annual family income <= Rs 2.5 Lakh' },
        { docType: 'DOMICILE_CERTIFICATE', name: 'Domicile / Residential Certificate', isMandatory: true, description: 'State domicile verification' },
        { docType: 'BONAFIDE_STUDENT', name: 'Institution Bonafide Certificate', isMandatory: true, description: 'Proof of current enrollment' },
        { docType: 'FEE_RECEIPT', name: 'College Fee Receipt', isMandatory: true, description: 'Actual fees paid breakdown' },
      ],
    },
    {
      code: SCHEME_CODES.TOP_CLASS,
      name: 'National Scholarship for Higher Education / Top Class Education for ST Students',
      shortName: 'Top Class ST',
      category: 'Central Sector',
      portalUrl: 'https://scholarships.gov.in',
      portalName: 'National Scholarship Portal (scholarships.gov.in)',
      fundingSplitInfo: '100% Central Sector Funding by MoTA',
      description: 'Empowers meritorious ST students who secure admission in notified premier institutes of excellence across India (IITs, NITs, IIMs, AIIMS, NLUs, etc.).',
      eligibility: {
        minIncomeLakhs: 0,
        maxIncomeLakhs: 6.0,
        allowedCourseLevels: [COURSE_LEVELS.GRADUATION, COURSE_LEVELS.POST_GRADUATION],
        requiresPremierInstitute: true,
        requiresUgcRecognised: false,
        requiresForeignAdmission: false,
        meritCriteria: 'Admitted into notified 246/265 Premier Institutes (IITs, AIIMS, IIMs, NITs, etc.)',
        preferences: ['Preference to girls', 'Preference to Divyang (PwD) students', 'Preference to PVTG students'],
      },
      allowanceStructure: {
        description: 'Full tuition and non-refundable fees, living allowance, stationery, and one-time computer grant.',
        components: [
          {
            title: 'Tuition & Academic Fees',
            amount: 'Full Reimbursement (up to ₹2,50,000/yr in private; actual in Govt)',
            frequency: 'Annual',
            notes: 'Paid directly or via student DBT depending on institute',
          },
          {
            title: 'Living Expenses Allowance',
            amount: '₹3,000 / month',
            frequency: 'Monthly (₹36,000/yr)',
            notes: 'Credited directly via DBT to student',
          },
          {
            title: 'Books & Stationery Allowance',
            amount: '₹5,000 / year',
            frequency: 'Annual',
            notes: 'Fixed non-refundable book grant',
          },
          {
            title: 'Computer / Laptop Assistance',
            amount: '₹45,000 one-time grant',
            frequency: 'Once during entire course duration',
            notes: 'For purchasing computer/laptop with accessories',
          },
        ],
      },
      dbtProvider: 'PFMS (Public Financial Management System)',
      grievanceContact: {
        portal: 'https://tribal.nic.in/Grievance',
        email: 'edu-tribal@nic.in',
        helpline: '011-23386128',
      },
      documentsRequired: [
        { docType: 'ST_CERTIFICATE', name: 'ST Caste Certificate', isMandatory: true, description: 'Competent authority certificate' },
        { docType: 'INCOME_CERTIFICATE', name: 'Income Certificate', isMandatory: true, description: 'Annual family income <= Rs 6.0 Lakh' },
        { docType: 'INSTITUTE_ADMISSION', name: 'Premier Institute Admission Letter & ID', isMandatory: true, description: 'Proof of admission in listed institute' },
        { docType: 'FEE_STRUCTURE', name: 'Verified Institutional Fee Breakdown', isMandatory: true, description: 'Signed by Registrar/Dean' },
        { docType: 'DIVYANG_CERTIFICATE', name: 'Disability Certificate (if applicable)', isMandatory: false, description: 'UDID card or Medical Board certificate' },
      ],
    },
    {
      code: SCHEME_CODES.NFST,
      name: 'National Fellowship for Higher Education of ST Students (NFST)',
      shortName: 'NFST Fellowship',
      category: 'Central Sector',
      portalUrl: 'https://fellowship.tribal.gov.in',
      portalName: 'MoTA Fellowship Portal (fellowship.tribal.gov.in) via Canara Bank SFMP',
      fundingSplitInfo: '100% Central Sector Funding by MoTA',
      description: 'Awards 750 fresh fellowships annually to meritorious ST students pursuing regular and full-time M.Phil and Ph.D. degrees in UGC-recognized universities.',
      eligibility: {
        minIncomeLakhs: 0,
        maxIncomeLakhs: 99.0, // No income ceiling for NFST; purely merit based on Master's marks
        allowedCourseLevels: [COURSE_LEVELS.MPHIL, COURSE_LEVELS.PHD],
        requiresPremierInstitute: false,
        requiresUgcRecognised: true,
        requiresForeignAdmission: false,
        annualAwardCap: { total: 750, generalST: 712, pvtgQuota: 38 },
        meritCriteria: 'Merit list drawn strictly based on marks scored in Master’s Degree examination; NET/JRF qualified given priority',
        preferences: ['Preference to girls', 'Preference to Divyang (PwD) ST scholars', 'Preference to PVTG scholars'],
      },
      allowanceStructure: {
        description: 'Monthly stipend (JRF/SRF rates) plus annual contingency and HRA as per central rules.',
        components: [
          {
            title: 'M.Phil Fellowship (JRF Rate)',
            amount: '₹25,000 / month',
            frequency: 'Monthly for 2 years',
            notes: 'Plus applicable HRA (8%, 16%, or 24% by city class)',
          },
          {
            title: 'Ph.D. Fellowship (JRF to SRF Rate)',
            amount: '₹28,000 / month (SRF up to ₹35,000/mo)',
            frequency: 'Monthly for up to 5 years',
            notes: 'Upgraded to SRF after 2 years upon satisfactory progress evaluation',
          },
          {
            title: 'Contingency Grant (Humanities & Social Sciences)',
            amount: '₹10,000 to ₹20,500 / year',
            frequency: 'Annual',
            notes: 'Field work, books, stationery, printing',
          },
          {
            title: 'Contingency Grant (Science, Engg & Technology)',
            amount: '₹12,000 to ₹25,000 / year',
            frequency: 'Annual',
            notes: 'Reagents, equipment consumables, computation',
          },
        ],
      },
      dbtProvider: 'Canara Bank SFMP Direct Credit & PFMS',
      grievanceContact: {
        portal: 'https://tribal.nic.in/Grievance',
        email: 'fellowship-tribal@nic.in',
        helpline: '011-23340517',
      },
      documentsRequired: [
        { docType: 'ST_CERTIFICATE', name: 'ST Caste Certificate', isMandatory: true, description: 'Caste verification' },
        { docType: 'MASTERS_MARKSHEET', name: 'Master’s Degree Consolidated Marksheet', isMandatory: true, description: 'Basis for merit ranking' },
        { docType: 'UGC_ADMISSION_LETTER', name: 'M.Phil / Ph.D. University Registration Letter', isMandatory: true, description: 'UGC recognized institute' },
        { docType: 'RESEARCH_SYNOPSIS', name: 'Approved Research Synopsis / Topic', isMandatory: true, description: 'Endorsed by Guide & HOD' },
        { docType: 'NET_JRF_SCORECARD', name: 'UGC-NET / CSIR-NET / GATE Scorecard', isMandatory: false, description: 'For priority score weightage' },
      ],
    },
    {
      code: SCHEME_CODES.NOS,
      name: 'National Overseas Scholarship for Scheduled Tribe Students (NOS)',
      shortName: 'NOS Overseas',
      category: 'Central Sector',
      portalUrl: 'https://overseas.tribal.gov.in',
      portalName: 'MoTA Overseas Portal (overseas.tribal.gov.in)',
      fundingSplitInfo: '100% Central Sector Funding by MoTA',
      description: 'Awards 20 scholarships annually (17 for ST + 3 for PVTG) to pursue Master’s, Ph.D., and Post-Doctoral research in accredited universities abroad.',
      eligibility: {
        minIncomeLakhs: 0,
        maxIncomeLakhs: 6.0,
        allowedCourseLevels: [
          COURSE_LEVELS.POST_GRADUATION,
          COURSE_LEVELS.PHD,
          COURSE_LEVELS.POST_DOC,
        ],
        requiresPremierInstitute: false,
        requiresUgcRecognised: false,
        requiresForeignAdmission: true,
        foreignAdmissionTimeLimitYears: 2,
        annualAwardCap: { total: 20, generalST: 17, pvtgQuota: 3 },
        meritCriteria: 'Selection through screening committee interview; candidates have 2 years to secure foreign admission upon selection',
        preferences: ['3 dedicated slots reserved for PVTG students', 'Preference to female ST scholars and Divyang'],
      },
      allowanceStructure: {
        description: 'Comprehensive foreign allowances in USD/GBP including tuition, maintenance, visa, medical insurance, and air travel.',
        components: [
          {
            title: 'Annual Maintenance Allowance (USA & other countries)',
            amount: 'USD $15,400 / year (or GBP £9,900/yr for UK)',
            frequency: 'Disbursed quarterly abroad via Indian Mission',
            notes: 'Covers overseas room, boarding, and daily upkeep',
          },
          {
            title: 'Annual Contingency Allowance',
            amount: 'USD $1,532 / year (or GBP £1,100/yr for UK)',
            frequency: 'Annual',
            notes: 'Books, research material, study tours',
          },
          {
            title: 'Tuition Fees & Examination Fees',
            amount: 'Actuals billed by foreign university',
            frequency: 'Semester / Annual',
            notes: 'Paid directly to accredited overseas university',
          },
          {
            title: 'Travel & Incidental Allowance',
            amount: 'Economy class airfare + Visa fees + Mandatory Health Insurance',
            frequency: 'One-time to and fro travel',
            notes: 'Booked via authorized Govt travel agencies (Balmer Lawrie / Ashoka Tours)',
          },
        ],
      },
      dbtProvider: 'Indian Missions Abroad & Ministry Direct Settlement',
      grievanceContact: {
        portal: 'https://tribal.nic.in/Grievance',
        email: 'fellowship-tribal@nic.in',
        helpline: '011-23386128',
      },
      documentsRequired: [
        { docType: 'ST_CERTIFICATE', name: 'ST Caste Certificate', isMandatory: true, description: 'Competent authority certificate' },
        { docType: 'INCOME_CERTIFICATE', name: 'Family Income Certificate', isMandatory: true, description: 'Total family income <= Rs 6.0 Lakh' },
        { docType: 'FOREIGN_OFFER_LETTER', name: 'Unconditional Foreign Offer Letter (or within 2 years)', isMandatory: false, description: 'QS/Times Higher Education top ranked universities' },
        { docType: 'PASSPORT_COPY', name: 'Valid Indian Passport', isMandatory: true, description: 'Minimum 2 years validity' },
        { docType: 'PVTG_CERTIFICATE', name: 'PVTG Verification Certificate (if claiming 3 quota slots)', isMandatory: false, description: 'Issued by District Collector/DM' },
      ],
    },
  ];

  for (const s of schemesData) {
    await Scheme.findOneAndUpdate({ code: s.code }, s, { upsert: true, new: true });
  }
  logger.info(`✅ Seeded ${schemesData.length} MoTA Scheme configurations.`);

  // 2. Seed Premier & UGC-Recognized Institutions
  const institutionsData = [
    {
      aisheCode: 'U-0306',
      name: 'Indian Institute of Technology Bombay (IIT Bombay)',
      type: 'IIT',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      isTopClassEligible: true,
      isUgcRecognised: true,
      nodalOfficerEmail: 'nodal.scholarships@iitb.ac.in',
    },
    {
      aisheCode: 'U-0109',
      name: 'Indian Institute of Technology Delhi (IIT Delhi)',
      type: 'IIT',
      state: 'Delhi',
      district: 'South Delhi',
      isTopClassEligible: true,
      isUgcRecognised: true,
      nodalOfficerEmail: 'scholarship.nodal@iitd.ac.in',
    },
    {
      aisheCode: 'U-0053',
      name: 'All India Institute of Medical Sciences (AIIMS New Delhi)',
      type: 'AIIMS',
      state: 'Delhi',
      district: 'South Delhi',
      isTopClassEligible: true,
      isUgcRecognised: true,
      nodalOfficerEmail: 'academics@aiims.edu',
    },
    {
      aisheCode: 'U-0139',
      name: 'Indian Institute of Management Ahmedabad (IIM Ahmedabad)',
      type: 'IIM',
      state: 'Gujarat',
      district: 'Ahmedabad',
      isTopClassEligible: true,
      isUgcRecognised: true,
      nodalOfficerEmail: 'financialaid@iima.ac.in',
    },
    {
      aisheCode: 'U-0355',
      name: 'National Institute of Technology Rourkela (NIT Rourkela)',
      type: 'NIT',
      state: 'Odisha',
      district: 'Sundargarh',
      isTopClassEligible: true,
      isUgcRecognised: true,
      nodalOfficerEmail: 'scholarship@nitrkl.ac.in',
    },
    {
      aisheCode: 'U-0108',
      name: 'Jawaharlal Nehru University (JNU New Delhi)',
      type: 'Central University',
      state: 'Delhi',
      district: 'South West Delhi',
      isTopClassEligible: false,
      isUgcRecognised: true,
      nodalOfficerEmail: 'dean.students@jnu.ac.in',
    },
    {
      aisheCode: 'S-7721',
      name: 'Eklavya Model Residential School (EMRS) Mayurbhanj',
      type: 'Secondary/Higher Secondary School',
      state: 'Odisha',
      district: 'Mayurbhanj',
      isTopClassEligible: false,
      isUgcRecognised: false,
      nodalOfficerEmail: 'emrs.mayurbhanj@odisha.gov.in',
    },
  ];

  for (const inst of institutionsData) {
    await Institution.findOneAndUpdate({ aisheCode: inst.aisheCode }, inst, { upsert: true, new: true });
  }
  logger.info(`✅ Seeded ${institutionsData.length} Premier & Higher Education Institutions.`);

  // 3. Seed Demo Users & Students
  const usersToSeed = [
    // Pre-Matric ST Student
    {
      phone: '9876543210',
      role: ROLES.STUDENT,
      name: 'Birsa Munda Jr.',
      studentProfile: {
        name: 'Birsa Munda Jr.',
        dob: new Date('2009-07-15'),
        gender: 'Male',
        tribe: 'Santhal',
        isPVTG: false,
        isDivyang: false,
        state: 'Odisha',
        district: 'Mayurbhanj',
        address: 'Village Baripada, Post Bhanjpur',
        pincode: '757001',
        familyAnnualIncome: 140000,
        apaarId: 'APAAR-2026-9901-4411',
        currentClass: 9,
        courseLevel: COURSE_LEVELS.PRE_MATRIC,
        course: 'Class IX (Secondary)',
        yearOfStudy: 1,
        institutionName: 'Eklavya Model Residential School (EMRS) Mayurbhanj',
        aisheCode: 'S-7721',
        isHosteller: true,
        aadhaarDetails: {
          aadhaarLast4: '4821',
          aadhaarVerificationToken: generateAadhaarToken('123456784821'),
          isVerified: true,
          verifiedAt: new Date(),
        },
        bankDetails: {
          accountHolderName: 'Birsa Munda Jr.',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          maskedAccountNumber: '••••••••4821',
          encryptedAccountToken: encrypt('102938474821'),
          isDbtLinked: true,
        },
        activeScholarship: {
          schemeCode: null,
          status: 'Not applied',
        },
      },
    },

    // Post-Matric ST Student
    {
      phone: '9876543211',
      role: ROLES.STUDENT,
      name: 'Rani Durgavati Gond',
      studentProfile: {
        name: 'Rani Durgavati Gond',
        dob: new Date('2004-11-20'),
        gender: 'Female',
        tribe: 'Gond',
        isPVTG: false,
        isDivyang: false,
        state: 'Madhya Pradesh',
        district: 'Mandla',
        address: 'Near Narmada Ghat, Mandla City',
        pincode: '481661',
        familyAnnualIncome: 185000,
        apaarId: 'APAAR-2026-8802-5522',
        courseLevel: COURSE_LEVELS.GRADUATION,
        course: 'B.Sc. Nursing (3rd Year)',
        yearOfStudy: 3,
        institutionName: 'Government Medical College & Hospital Jabalpur',
        aisheCode: 'U-0312',
        isHosteller: true,
        aadhaarDetails: {
          aadhaarLast4: '7192',
          aadhaarVerificationToken: generateAadhaarToken('987654327192'),
          isVerified: true,
          verifiedAt: new Date(),
        },
        bankDetails: {
          accountHolderName: 'Rani Durgavati Gond',
          ifscCode: 'PUNB0123400',
          bankName: 'Punjab National Bank',
          maskedAccountNumber: '••••••••7192',
          encryptedAccountToken: encrypt('998877667192'),
          isDbtLinked: true,
        },
        activeScholarship: {
          schemeCode: SCHEME_CODES.POST_MATRIC,
          applicationId: 'MOTA/POST/2025/99812',
          schemeName: 'Post-Matric Scholarship for ST Students',
          sanctionedYear: '2025-26',
          status: 'Sanctioned',
        },
      },
    },

    // Top Class ST Student (IIT Bombay + Divyang)
    {
      phone: '9876543212',
      role: ROLES.STUDENT,
      name: 'Jaipal Singh Munda',
      studentProfile: {
        name: 'Jaipal Singh Munda',
        dob: new Date('2003-04-10'),
        gender: 'Male',
        tribe: 'Munda',
        isPVTG: false,
        isDivyang: true,
        divyangType: 'Locomotor Disability',
        divyangPercentage: 45,
        state: 'Jharkhand',
        district: 'Ranchi',
        address: 'Sector 4, Harmu Housing Colony',
        pincode: '834002',
        familyAnnualIncome: 420000, // Under 6 Lakh
        apaarId: 'APAAR-2026-7703-6633',
        courseLevel: COURSE_LEVELS.GRADUATION,
        course: 'B.Tech in Computer Science and Engineering',
        yearOfStudy: 2,
        institutionName: 'Indian Institute of Technology Bombay (IIT Bombay)',
        aisheCode: 'U-0306',
        isHosteller: true,
        aadhaarDetails: {
          aadhaarLast4: '3319',
          aadhaarVerificationToken: generateAadhaarToken('334455663319'),
          isVerified: true,
          verifiedAt: new Date(),
        },
        bankDetails: {
          accountHolderName: 'Jaipal Singh Munda',
          ifscCode: 'SBIN0001107',
          bankName: 'State Bank of India (IIT Powai Branch)',
          maskedAccountNumber: '••••••••3319',
          encryptedAccountToken: encrypt('554433223319'),
          isDbtLinked: true,
        },
        activeScholarship: {
          schemeCode: SCHEME_CODES.TOP_CLASS,
          applicationId: 'MOTA/TOP/2025/00412',
          schemeName: 'Top Class Education for ST Students',
          sanctionedYear: '2025-26',
          status: 'Disbursed',
        },
      },
    },

    // NFST Fellow (PhD scholar, PVTG Birhor)
    {
      phone: '9876543213',
      role: ROLES.STUDENT,
      name: 'Shanti Birhor Soren',
      studentProfile: {
        name: 'Shanti Birhor Soren',
        dob: new Date('1998-09-05'),
        gender: 'Female',
        tribe: 'Birhor (PVTG)',
        isPVTG: true,
        pvtgCommunity: 'Birhor',
        isDivyang: false,
        state: 'West Bengal',
        district: 'Purulia',
        address: 'Bagmundi Tribal Settlement',
        pincode: '723152',
        familyAnnualIncome: 95000,
        apaarId: 'APAAR-2026-6604-7744',
        courseLevel: COURSE_LEVELS.PHD,
        course: 'Ph.D. in Tribal Linguistics & Folklore',
        yearOfStudy: 2,
        institutionName: 'Jawaharlal Nehru University (JNU New Delhi)',
        aisheCode: 'U-0108',
        isHosteller: true,
        mastersPercentage: 78.5,
        aadhaarDetails: {
          aadhaarLast4: '9941',
          aadhaarVerificationToken: generateAadhaarToken('667788999941'),
          isVerified: true,
          verifiedAt: new Date(),
        },
        bankDetails: {
          accountHolderName: 'Shanti Birhor Soren',
          ifscCode: 'CNRB0002812',
          bankName: 'Canara Bank (SFMP Enabled)',
          maskedAccountNumber: '••••••••9941',
          encryptedAccountToken: encrypt('776655449941'),
          isDbtLinked: true,
        },
        activeScholarship: {
          schemeCode: SCHEME_CODES.NFST,
          applicationId: 'MOTA/NFST/2025/00711',
          schemeName: 'National Fellowship for ST Students (NFST)',
          sanctionedYear: '2025-26',
          status: 'Sanctioned',
        },
      },
    },

    // NOS Aspirant (Master's Abroad)
    {
      phone: '9876543214',
      role: ROLES.STUDENT,
      name: 'Mangal Oraon',
      studentProfile: {
        name: 'Mangal Oraon',
        dob: new Date('2000-02-14'),
        gender: 'Male',
        tribe: 'Oraon',
        isPVTG: false,
        isDivyang: false,
        state: 'Jharkhand',
        district: 'Gumla',
        address: 'Bishunpur Block',
        pincode: '835331',
        familyAnnualIncome: 380000, // <= 6.0 Lakh
        apaarId: 'APAAR-2026-5505-8855',
        courseLevel: COURSE_LEVELS.POST_GRADUATION,
        course: 'M.S. in Renewable Energy & Climate Systems (Overseas Aspirant)',
        yearOfStudy: 1,
        institutionName: 'University of Edinburgh (Offer Secured)',
        isHosteller: false,
        mastersPercentage: 82.0,
        aadhaarDetails: {
          aadhaarLast4: '5561',
          aadhaarVerificationToken: generateAadhaarToken('889900115561'),
          isVerified: true,
          verifiedAt: new Date(),
        },
        bankDetails: {
          accountHolderName: 'Mangal Oraon',
          ifscCode: 'BARB0POWAIX',
          bankName: 'Bank of Baroda',
          maskedAccountNumber: '••••••••5561',
          encryptedAccountToken: encrypt('332211005561'),
          isDbtLinked: true,
        },
        activeScholarship: {
          schemeCode: null,
          status: 'Not applied',
        },
      },
    },

    // Guardian
    {
      phone: '9876543220',
      role: ROLES.GUARDIAN,
      name: 'Somra Munda (Parent/Guardian)',
    },

    // Institute Nodal Officer (IIT Bombay)
    {
      phone: '9876543230',
      role: ROLES.INSTITUTE_NODAL,
      name: 'Prof. A. K. Meena (Nodal Officer)',
      email: 'nodal.scholarships@iitb.ac.in',
      assignedAisheCode: 'U-0306',
    },

    // State Nodal Officer (Odisha)
    {
      phone: '9876543240',
      role: ROLES.STATE_NODAL,
      name: 'Rajeshwar Hembram (State Officer)',
      email: 'stsc.scholarships@odisha.gov.in',
      assignedState: 'Odisha',
    },

    // MoTA Admin (Ministry Central Administrator)
    {
      phone: '9876543250',
      role: ROLES.MOTA_ADMIN,
      name: 'Dr. Rameshwar Oraon (MoTA Admin)',
      email: 'admin-scholarship@tribal.gov.in',
    },
  ];

  let guardianUser = null;

  for (const uData of usersToSeed) {
    const { studentProfile, ...userData } = uData;
    let user = await User.findOne({ phone: userData.phone });

    if (!user) {
      user = await User.create(userData);
    } else {
      Object.assign(user, userData);
      await user.save();
    }

    if (user.role === ROLES.GUARDIAN) {
      guardianUser = user;
    }

    if (studentProfile) {
      studentProfile.userId = user._id;
      let student = await Student.findOne({ userId: user._id });
      if (!student) {
        student = await Student.create(studentProfile);
      } else {
        Object.assign(student, studentProfile);
        await student.save();
      }
    }
  }

  // Link first student (Birsa Munda Jr.) to the demo guardian
  if (guardianUser) {
    const firstStudent = await Student.findOne({ name: 'Birsa Munda Jr.' });
    if (firstStudent) {
      firstStudent.guardianId = guardianUser._id;
      await firstStudent.save();
      logger.info('👨‍👧 Linked ward Birsa Munda Jr. to Demo Guardian account.');
    }
  }

  // 4. Seed Demo Applications in various scheme lifecycle stages
  const studentBirsa = await Student.findOne({ name: 'Birsa Munda Jr.' });
  const studentRani = await Student.findOne({ name: 'Rani Durgavati Gond' });
  const studentJaipal = await Student.findOne({ name: 'Jaipal Singh Munda' });
  const studentShanti = await Student.findOne({ name: 'Shanti Birhor Soren' });
  const studentMangal = await Student.findOne({ name: 'Mangal Oraon' });

  if (studentBirsa) {
    await Application.findOneAndUpdate(
      { applicationNumber: 'MOTA/2026/PRE/10041' },
      {
        applicationNumber: 'MOTA/2026/PRE/10041',
        studentId: studentBirsa._id,
        userId: studentBirsa.userId,
        schemeCode: SCHEME_CODES.PRE_MATRIC,
        schemeName: 'Pre-Matric Scholarship for ST Students (Classes IX & X)',
        academicYear: '2026-27',
        status: APPLICATION_STATUSES.DRAFT,
        currentStep: 3,
        formData: {
          applicantName: studentBirsa.name,
          tribe: studentBirsa.tribe,
          state: studentBirsa.state,
          district: studentBirsa.district,
          courseLevel: studentBirsa.courseLevel,
          course: studentBirsa.course,
          institutionName: studentBirsa.institutionName,
          familyAnnualIncome: studentBirsa.familyAnnualIncome,
          isHosteller: true,
          estimatedMaintenanceAllowance: '₹525 / month (Hosteller)',
          estimatedTotalEntitlement: '₹5,250 for 10 months',
        },
        timeline: [
          {
            stage: 'Submission',
            status: 'Draft Saved',
            remarks: 'Application wizard initiated. Auto-saved at step 3.',
            actor: 'Student',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      { upsert: true, new: true }
    );
  }

  if (studentRani) {
    await Application.findOneAndUpdate(
      { applicationNumber: 'MOTA/POST/2025/99812' },
      {
        applicationNumber: 'MOTA/POST/2025/99812',
        studentId: studentRani._id,
        userId: studentRani.userId,
        schemeCode: SCHEME_CODES.POST_MATRIC,
        schemeName: 'Post-Matric Scholarship for ST Students',
        academicYear: '2025-26',
        status: APPLICATION_STATUSES.SANCTIONED,
        currentStep: 5,
        formData: {
          applicantName: studentRani.name,
          tribe: studentRani.tribe,
          state: studentRani.state,
          course: studentRani.course,
          institutionName: studentRani.institutionName,
          familyAnnualIncome: studentRani.familyAnnualIncome,
          estimatedMaintenanceAllowance: '₹1,200 / month (Group I Professional Course)',
          estimatedTotalEntitlement: '₹14,400 + Compulsory Tuition Fees',
        },
        timeline: [
          { stage: 'Submission', status: 'Submitted', remarks: 'Application received via Portal.', actor: 'Student', timestamp: new Date('2025-08-10') },
          { stage: 'Institute Verification', status: 'Verified', remarks: 'Bonafide & marks verified by GMC Jabalpur.', actor: 'Institute Nodal Officer', timestamp: new Date('2025-08-22') },
          { stage: 'State Verification', status: 'Approved', remarks: 'Tribal Welfare Dept MP approved eligibility.', actor: 'State Nodal Officer', timestamp: new Date('2025-09-05') },
          { stage: 'Ministry Sanction', status: 'Sanctioned', remarks: 'Central share generated under DBT Tribal order #7712.', actor: 'MoTA Sanction Officer', timestamp: new Date('2025-10-01') },
          { stage: 'PFMS DBT Disbursement', status: 'In Process', remarks: 'PFMS credit batch file queued for Aadhaar bank payment.', actor: 'PFMS Gateway', timestamp: new Date('2025-10-15') },
        ],
        dbtPayment: {
          amountSanctioned: 14400,
          amountDisbursed: 0,
          paymentStatus: 'Pending',
          pfmsTransactionId: 'PFMS-2025-POST-BATCH-0042',
        },
      },
      { upsert: true, new: true }
    );
  }

  if (studentJaipal) {
    await Application.findOneAndUpdate(
      { applicationNumber: 'MOTA/TOP/2025/00412' },
      {
        applicationNumber: 'MOTA/TOP/2025/00412',
        studentId: studentJaipal._id,
        userId: studentJaipal.userId,
        schemeCode: SCHEME_CODES.TOP_CLASS,
        schemeName: 'National Scholarship for Higher Education / Top Class Education for ST Students',
        academicYear: '2025-26',
        status: APPLICATION_STATUSES.DISBURSED,
        currentStep: 5,
        formData: {
          applicantName: studentJaipal.name,
          tribe: studentJaipal.tribe,
          isDivyang: true,
          divyangType: 'Locomotor Disability',
          divyangPercentage: 45,
          course: studentJaipal.course,
          institutionName: studentJaipal.institutionName,
          familyAnnualIncome: studentJaipal.familyAnnualIncome,
          estimatedTotalEntitlement: '₹2,50,000 Tuition + ₹36,000 Living + ₹45,000 Computer + ₹5,000 Books',
        },
        timeline: [
          { stage: 'Submission', status: 'Submitted', remarks: 'NSP Application synchronized.', actor: 'Student', timestamp: new Date('2025-07-20') },
          { stage: 'Institute Verification', status: 'Verified', remarks: 'Verified by IIT Bombay Nodal Office.', actor: 'Prof. A. K. Meena', timestamp: new Date('2025-08-05') },
          { stage: 'State Verification', status: 'Exempt', remarks: 'Central Sector Scheme - 100% MoTA funding.', actor: 'System', timestamp: new Date('2025-08-06') },
          { stage: 'Ministry Sanction', status: 'Sanctioned', remarks: 'Sanctioned by MoTA Higher Education Division.', actor: 'MoTA Admin', timestamp: new Date('2025-08-25') },
          { stage: 'PFMS DBT Disbursement', status: 'Disbursed', remarks: 'Direct credit via PFMS to SBI Powai Account (••••••••3319).', actor: 'PFMS DBT', timestamp: new Date('2025-09-12') },
        ],
        dbtPayment: {
          amountSanctioned: 86000,
          amountDisbursed: 86000,
          paymentStatus: 'Credited',
          pfmsTransactionId: 'PFMS-2025-TOP-991204',
          disbursedDate: new Date('2025-09-12'),
        },
      },
      { upsert: true, new: true }
    );
  }

  if (studentShanti) {
    await Application.findOneAndUpdate(
      { applicationNumber: 'MOTA/NFST/2025/00711' },
      {
        applicationNumber: 'MOTA/NFST/2025/00711',
        studentId: studentShanti._id,
        userId: studentShanti.userId,
        schemeCode: SCHEME_CODES.NFST,
        schemeName: 'National Fellowship for Higher Education of ST Students (NFST)',
        academicYear: '2025-26',
        status: APPLICATION_STATUSES.DEFICIENCY_RAISED,
        currentStep: 4,
        formData: {
          applicantName: studentShanti.name,
          tribe: studentShanti.tribe,
          isPVTG: true,
          pvtgCommunity: 'Birhor',
          course: studentShanti.course,
          institutionName: studentShanti.institutionName,
          mastersPercentage: 78.5,
          estimatedTotalEntitlement: '₹28,000 / month + HRA + ₹12,000 Contingency',
        },
        timeline: [
          { stage: 'Submission', status: 'Submitted', remarks: 'NFST Fellowship application submitted.', actor: 'Student', timestamp: new Date('2025-09-01') },
          { stage: 'Institute Verification', status: 'Deficiency Raised', remarks: 'Guide endorsement stamp missing on doctoral synopsis.', actor: 'University Dean Office', timestamp: new Date('2025-09-15') },
        ],
        deficiencies: [
          {
            deficiencyId: 'DEF-NFST-001',
            field: 'Research Synopsis Endorsement',
            description: 'Please re-upload approved research synopsis with signatures and official seals of Doctoral Guide and Head of Department.',
            status: 'OPEN',
            raisedBy: 'University Nodal Officer (JNU)',
            raisedAt: new Date('2025-09-15'),
          },
        ],
      },
      { upsert: true, new: true }
    );
  }

  if (studentMangal) {
    await Application.findOneAndUpdate(
      { applicationNumber: 'MOTA/NOS/2026/00021' },
      {
        applicationNumber: 'MOTA/NOS/2026/00021',
        studentId: studentMangal._id,
        userId: studentMangal.userId,
        schemeCode: SCHEME_CODES.NOS,
        schemeName: 'National Overseas Scholarship for Scheduled Tribe Students (NOS)',
        academicYear: '2026-27',
        status: APPLICATION_STATUSES.UNDER_VERIFICATION,
        currentStep: 5,
        formData: {
          applicantName: studentMangal.name,
          tribe: studentMangal.tribe,
          course: studentMangal.course,
          institutionName: 'University of Edinburgh',
          familyAnnualIncome: studentMangal.familyAnnualIncome,
          estimatedTotalEntitlement: 'USD $15,400 Maintenance + USD $1,532 Contingency + Full Tuition & Visa',
        },
        timeline: [
          { stage: 'Submission', status: 'Submitted', remarks: 'Overseas scholarship dossier submitted.', actor: 'Student', timestamp: new Date('2026-01-10') },
          { stage: 'Institute Verification', status: 'Completed', remarks: 'Domestic degree verified.', actor: 'Screening Officer', timestamp: new Date('2026-01-28') },
          { stage: 'Ministry Sanction', status: 'In Review', remarks: 'Shortlisted for Ministry Steering Committee Interview.', actor: 'MoTA Overseas Cell', timestamp: new Date('2026-02-14') },
        ],
      },
      { upsert: true, new: true }
    );
  }

  // 5. Seed Document Wallet items
  if (studentBirsa) {
    await Document.findOneAndUpdate(
      { studentId: studentBirsa._id, docType: 'ST_CERTIFICATE' },
      {
        studentId: studentBirsa._id,
        userId: studentBirsa.userId,
        docType: 'ST_CERTIFICATE',
        title: 'Santhal Tribe Caste Certificate',
        documentNumber: 'ST/OD/2023/88194',
        issuingAuthority: 'Tahasildar Baripada, Odisha',
        issuedDate: new Date('2023-04-15'),
        fileSize: '340 KB',
        source: 'DIGILOCKER',
        verificationStatus: 'VERIFIED',
        verificationSource: 'DigiLocker Certified PKI',
        verifiedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    await Document.findOneAndUpdate(
      { studentId: studentBirsa._id, docType: 'INCOME_CERTIFICATE' },
      {
        studentId: studentBirsa._id,
        userId: studentBirsa.userId,
        docType: 'INCOME_CERTIFICATE',
        title: 'Parental Income Certificate (<= ₹2.5L)',
        documentNumber: 'INC/OD/2026/00192',
        issuingAuthority: 'Revenue Officer Mayurbhanj',
        issuedDate: new Date('2026-01-10'),
        validUntil: new Date('2027-03-31'),
        fileSize: '290 KB',
        source: 'DIGILOCKER',
        verificationStatus: 'VERIFIED',
        verificationSource: 'DigiLocker Certified PKI',
        verifiedAt: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  if (studentJaipal) {
    await Document.findOneAndUpdate(
      { studentId: studentJaipal._id, docType: 'ST_CERTIFICATE' },
      {
        studentId: studentJaipal._id,
        userId: studentJaipal.userId,
        docType: 'ST_CERTIFICATE',
        title: 'Munda Scheduled Tribe Certificate',
        documentNumber: 'ST/JH/2022/44120',
        issuingAuthority: 'Deputy Commissioner Ranchi',
        source: 'DIGILOCKER',
        verificationStatus: 'VERIFIED',
        verificationSource: 'DigiLocker Certified PKI',
        verifiedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    await Document.findOneAndUpdate(
      { studentId: studentJaipal._id, docType: 'DIVYANG_CERTIFICATE' },
      {
        studentId: studentJaipal._id,
        userId: studentJaipal.userId,
        docType: 'DIVYANG_CERTIFICATE',
        title: 'UDID Unique Disability ID Card (45% Locomotor)',
        documentNumber: 'UDID/JH/2021/9921',
        issuingAuthority: 'District Medical Board Ranchi',
        source: 'DIGILOCKER',
        verificationStatus: 'VERIFIED',
        verificationSource: 'Department of Empowerment of PwD (UDID Portal)',
        verifiedAt: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  // 6. Seed Historical DBT Payments
  if (studentJaipal) {
    await Payment.findOneAndUpdate(
      { pfmsTransactionId: 'PFMS-2025-TOP-991204' },
      {
        studentId: studentJaipal._id,
        schemeCode: SCHEME_CODES.TOP_CLASS,
        schemeName: 'National Scholarship for Higher Education (Top Class ST)',
        academicYear: '2025-26',
        amount: 45000,
        paymentType: 'Laptop / Computer Grant',
        status: 'Credited',
        pfmsTransactionId: 'PFMS-2025-TOP-991204',
        bankReferenceNo: 'SBI-NEFT-2025-0912-44129',
        bankName: 'State Bank of India',
        maskedAccount: '••••••••3319',
        ifscCode: 'SBIN0001107',
        creditDate: new Date('2025-09-12'),
      },
      { upsert: true, new: true }
    );

    await Payment.findOneAndUpdate(
      { pfmsTransactionId: 'PFMS-2025-TOP-991205' },
      {
        studentId: studentJaipal._id,
        schemeCode: SCHEME_CODES.TOP_CLASS,
        schemeName: 'National Scholarship for Higher Education (Top Class ST)',
        academicYear: '2025-26',
        amount: 36000,
        paymentType: 'Living Expenses',
        status: 'Credited',
        pfmsTransactionId: 'PFMS-2025-TOP-991205',
        bankReferenceNo: 'SBI-NEFT-2025-0912-44130',
        bankName: 'State Bank of India',
        maskedAccount: '••••••••3319',
        ifscCode: 'SBIN0001107',
        creditDate: new Date('2025-09-12'),
      },
      { upsert: true, new: true }
    );

    await Payment.findOneAndUpdate(
      { pfmsTransactionId: 'PFMS-2025-TOP-991206' },
      {
        studentId: studentJaipal._id,
        schemeCode: SCHEME_CODES.TOP_CLASS,
        schemeName: 'National Scholarship for Higher Education (Top Class ST)',
        academicYear: '2025-26',
        amount: 5000,
        paymentType: 'Books & Stationery Grant',
        status: 'Credited',
        pfmsTransactionId: 'PFMS-2025-TOP-991206',
        bankReferenceNo: 'SBI-NEFT-2025-0912-44131',
        bankName: 'State Bank of India',
        maskedAccount: '••••••••3319',
        ifscCode: 'SBIN0001107',
        creditDate: new Date('2025-09-12'),
      },
      { upsert: true, new: true }
    );
  }

  if (studentRani) {
    await Payment.findOneAndUpdate(
      { pfmsTransactionId: 'PFMS-2025-POST-BATCH-0042' },
      {
        studentId: studentRani._id,
        schemeCode: SCHEME_CODES.POST_MATRIC,
        schemeName: 'Post-Matric Scholarship for ST Students',
        academicYear: '2025-26',
        amount: 14400,
        paymentType: 'Maintenance Allowance',
        status: 'Pending',
        pfmsTransactionId: 'PFMS-2025-POST-BATCH-0042',
        bankName: 'Punjab National Bank',
        maskedAccount: '••••••••7192',
        ifscCode: 'PUNB0123400',
      },
      { upsert: true, new: true }
    );
  }

  // 7. Seed Notifications
  if (studentBirsa) {
    await Notification.findOneAndUpdate(
      { userId: studentBirsa.userId, title: 'Welcome to Unified Tribal Scholarship Portal' },
      {
        userId: studentBirsa.userId,
        studentId: studentBirsa._id,
        title: 'Welcome to Unified Tribal Scholarship Portal',
        message: 'Your ST profile has been initialized with DigiLocker. You can now apply across all 5 MoTA schemes.',
        type: 'SECURITY',
        actionUrl: '/schemes',
        isRead: false,
      },
      { upsert: true, new: true }
    );

    await Notification.findOneAndUpdate(
      { userId: studentBirsa.userId, title: 'Draft Saved: Pre-Matric ST Application' },
      {
        userId: studentBirsa.userId,
        studentId: studentBirsa._id,
        title: 'Draft Saved: Pre-Matric ST Application',
        message: 'Your application for Pre-Matric (Class IX) is saved at Step 3. You can resume anytime.',
        type: 'REMINDER',
        schemeCode: 'PRE_MATRIC',
        actionUrl: '/apply/PRE_MATRIC',
        isRead: false,
      },
      { upsert: true, new: true }
    );
  }

  if (studentJaipal) {
    await Notification.findOneAndUpdate(
      { userId: studentJaipal.userId, title: 'PFMS DBT Credit: ₹86,000 Credited' },
      {
        userId: studentJaipal.userId,
        studentId: studentJaipal._id,
        title: 'PFMS DBT Credit: ₹86,000 Credited',
        message: 'Direct Benefit Transfer for Top Class Education (Laptop + Living allowance) credited to SBI account ••••••••3319.',
        type: 'DBT_CREDIT',
        schemeCode: 'TOP_CLASS',
        actionUrl: '/payments',
        isRead: false,
      },
      { upsert: true, new: true }
    );
  }

  if (studentShanti) {
    await Notification.findOneAndUpdate(
      { userId: studentShanti.userId, title: 'Deficiency Raised: Guide Endorsement Required' },
      {
        userId: studentShanti.userId,
        studentId: studentShanti._id,
        title: 'Deficiency Raised: Guide Endorsement Required',
        message: 'University Nodal Officer requested re-upload of Doctoral research synopsis with official Guide stamp.',
        type: 'DEFICIENCY',
        schemeCode: 'NFST',
        actionUrl: '/apply/NFST',
        isRead: false,
      },
      { upsert: true, new: true }
    );
  }

  // 8. Seed Sample Grievance Ticket
  if (studentJaipal) {
    await Grievance.findOneAndUpdate(
      { ticketNumber: 'GRV/2025/TOP/00412' },
      {
        ticketNumber: 'GRV/2025/TOP/00412',
        studentId: studentJaipal._id,
        userId: studentJaipal.userId,
        schemeCode: 'TOP_CLASS',
        category: 'DBT_DISBURSEMENT_DELAY',
        subject: 'Inquiry regarding Laptop Grant DBT processing date',
        description: 'Wanted confirmation on whether the ₹45,000 computer grant is disbursed in one installment along with living expenses.',
        status: 'RESOLVED',
        priority: 'NORMAL',
        officerResponse: 'Resolved: Laptop assistance of ₹45,000 and Living expenses have been released via PFMS batch #991204.',
        resolvedBy: 'MoTA Scholarship Division (NSP Cell)',
        resolvedAt: new Date('2025-09-13'),
      },
      { upsert: true, new: true }
    );
  }

  logger.info(`✅ Seeded Wallet Documents, DBT Payments, Notifications & Grievance tickets.`);
  logger.info(`✅ Seeded demo applications across all 5 scheme stages.`);
  logger.info(`✅ Seeded ${usersToSeed.length} Demo Users & Profiles across all roles.`);
  logger.info('🎉 Database seeding completed successfully!');
};

// If run directly via `node src/seed/seedData.js`
if (process.argv[1]?.includes('seedData.js')) {
  import('dotenv').then(async (dotenv) => {
    dotenv.config();
    const { connectDB, disconnectDB } = await import('../config/db.js');
    await connectDB();
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  });
}
