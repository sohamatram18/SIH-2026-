// Comprehensive Client-Side Mock Data & Engine for Vercel / Static Deployment
// Ensures 100% functionality on any browser, mobile, or desktop platform without an external backend.

export const MOCK_SCHEMES = [
  {
    code: 'PRE_MATRIC',
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
      allowedCourseLevels: ['Pre-Matric'],
      requiresPremierInstitute: false,
      requiresUgcRecognised: false,
      requiresForeignAdmission: false,
      meritCriteria: 'Enrolled in recognized Class IX or X school',
      preferences: ['Full coverage of eligible ST students with verified parental income <= Rs 2.5 Lakh/yr'],
    },
    allowanceStructure: {
      description: 'Monthly maintenance allowance for 10 months per academic year plus book/contingency grants.',
      components: [
        { title: 'Day Scholar Allowance', amount: '₹3,500 / year (₹350/mo for 10 months)', frequency: '10 months/year', notes: 'For students attending regular day school' },
        { title: 'Hosteller Allowance', amount: '₹7,000 / year (₹700/mo for 10 months)', frequency: '10 months/year', notes: 'For students residing in recognized school hostels' }
      ]
    },
    dbtProvider: 'PFMS (Public Financial Management System)',
    version: 1
  },
  {
    code: 'POST_MATRIC',
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
      allowedCourseLevels: ['Post-Matric', 'Graduation', 'Post-Graduation'],
      requiresPremierInstitute: false,
      requiresUgcRecognised: false,
      requiresForeignAdmission: false,
      meritCriteria: 'Admitted in any recognized post-secondary diploma, degree, or professional program',
      preferences: ['Full coverage of eligible ST students with verified parental income <= Rs 2.5 Lakh/yr'],
    },
    allowanceStructure: {
      description: 'Two components: Compulsory non-refundable fees (100% reimbursed) + Group-wise living allowance.',
      components: [
        { title: 'Compulsory Course Fees', amount: '100% Full Reimbursement', frequency: 'Annual', notes: 'Tuition fees, enrollment fees, exam fees' },
        { title: 'Maintenance Allowance (Group I to IV)', amount: '₹2,500 to ₹13,500 / year', frequency: 'Annual', notes: 'Group I (Professional) up to ₹13,500 hosteller; Group IV up to ₹4,000' }
      ]
    },
    dbtProvider: 'PFMS (Public Financial Management System)',
    version: 1
  },
  {
    code: 'TOP_CLASS',
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
      allowedCourseLevels: ['Graduation', 'Post-Graduation'],
      requiresPremierInstitute: true,
      requiresUgcRecognised: false,
      requiresForeignAdmission: false,
      meritCriteria: 'Admitted into notified 246 Premier Institutes (IITs, AIIMS, IIMs, NITs, etc.)',
      preferences: ['Preference to girls', 'Preference to Divyang (PwD) students', 'Preference to PVTG students'],
    },
    allowanceStructure: {
      description: 'Full tuition and non-refundable fees, living allowance, stationery, and one-time computer grant.',
      components: [
        { title: 'Tuition & Academic Fees', amount: 'Full Reimbursement (up to ₹2,50,000/yr in private; actual in Govt)', frequency: 'Annual', notes: '100% non-refundable fees reimbursed' },
        { title: 'Living Expenses Allowance', amount: '₹3,000 / month (₹36,000/year)', frequency: 'Monthly', notes: 'Direct PFMS bank credit' },
        { title: 'Books & Stationery Allowance', amount: '₹5,000 / year', frequency: 'Annual', notes: 'Fixed annual grant' },
        { title: 'Computer / Laptop Assistance', amount: '₹45,000 one-time grant', frequency: 'Once in entire course', notes: 'For purchasing computer/laptop with accessories' }
      ]
    },
    dbtProvider: 'PFMS (Public Financial Management System)',
    version: 1
  },
  {
    code: 'NFST',
    name: 'National Fellowship for Higher Education of ST Students (NFST)',
    shortName: 'NFST Fellowship',
    category: 'Central Sector',
    portalUrl: 'https://fellowship.tribal.gov.in',
    portalName: 'MoTA Fellowship Portal (fellowship.tribal.gov.in) via Canara Bank SFMP',
    fundingSplitInfo: '100% Central Sector Funding by MoTA',
    description: 'Awards 750 fresh fellowships annually to meritorious ST students pursuing regular and full-time M.Phil and Ph.D. degrees in UGC-recognized universities.',
    eligibility: {
      minIncomeLakhs: 0,
      maxIncomeLakhs: 99.0, // No income ceiling for NFST; purely merit based
      allowedCourseLevels: ['M.Phil', 'Ph.D.'],
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
        { title: 'M.Phil Fellowship (JRF Rate)', amount: '₹31,000 / month', frequency: 'Monthly for 2 years', notes: 'Plus applicable HRA (8%, 16%, or 24%)' },
        { title: 'Ph.D. Fellowship (SRF Rate)', amount: '₹35,000 / month', frequency: 'Monthly for up to 5 years', notes: 'Upgraded to SRF after 2 years upon evaluation' },
        { title: 'Contingency Grant (Humanities)', amount: '₹10,000 to ₹20,500 / year', frequency: 'Annual', notes: 'Field work, books, stationery, printing' },
        { title: 'Contingency Grant (Science/Engg)', amount: '₹12,000 to ₹25,000 / year', frequency: 'Annual', notes: 'Reagents, equipment consumables' }
      ]
    },
    dbtProvider: 'Canara Bank SFMP Direct Credit & PFMS',
    version: 1
  },
  {
    code: 'NOS',
    name: 'National Overseas Scholarship for Scheduled Tribe Students (NOS)',
    shortName: 'National Overseas (NOS)',
    category: 'Central Sector',
    portalUrl: 'https://overseas.tribal.gov.in',
    portalName: 'Standalone NOS Portal (overseas.tribal.gov.in)',
    fundingSplitInfo: '100% Central Sector Funding by MoTA',
    description: 'Empowers 20 meritorious ST scholars annually to pursue Master’s, Ph.D. and Post-Doctoral research in Top 500 QS World University Ranked foreign institutions.',
    eligibility: {
      minIncomeLakhs: 0,
      maxIncomeLakhs: 6.0,
      allowedCourseLevels: ['Post-Graduation', 'Ph.D.'],
      requiresPremierInstitute: false,
      requiresUgcRecognised: false,
      requiresForeignAdmission: true,
      annualAwardCap: { total: 20, generalST: 17, pvtgQuota: 3 },
      meritCriteria: 'Admission in Top 500 QS World University Ranked institution + Min 55% in qualifying degree + Age < 35 years',
      preferences: ['3 dedicated slots for Particularly Vulnerable Tribal Groups (PVTGs)'],
    },
    allowanceStructure: {
      description: '100% foreign tuition, annual living allowance, return international airfare, and visa fees.',
      components: [
        { title: 'Foreign Tuition & University Fees', amount: 'Actual full fees', frequency: 'Annual', notes: 'Paid directly to foreign university' },
        { title: 'Annual Maintenance (USA & Other)', amount: 'USD 15,400 / year', frequency: 'Annual', notes: 'Living and boarding stipend' },
        { title: 'Annual Maintenance (United Kingdom)', amount: 'GBP 9,900 / year', frequency: 'Annual', notes: 'Living and boarding stipend for UK' },
        { title: 'Contingency & Equipment Grant', amount: 'USD 1,500 / GBP 1,100 per year', frequency: 'Annual', notes: 'Books, research material, typing' },
        { title: 'International Airfare & Visa', amount: '100% Economy Airfare + Visa Fees', frequency: 'One-time per award', notes: 'Covered in full by MoTA' }
      ]
    },
    dbtProvider: 'MoTA Overseas Division Direct Forex Transfer',
    version: 1
  }
];

export const MOCK_PERSONAS = {
  student_prematric: {
    user: {
      id: 'usr_prematric_01',
      phone: '9876543210',
      role: 'student',
      name: 'Birsa Munda Jr.',
      assignedState: 'Jharkhand',
      hasProfile: true
    },
    student: {
      id: 'stu_prematric_01',
      name: 'Birsa Munda Jr.',
      apaarId: '1001-2002-3003',
      fatherName: 'Late Sh. Sugana Munda',
      category: 'ST',
      subTribe: 'Munda',
      stateOfDomicile: 'Jharkhand',
      district: 'Khunti',
      annualIncomeLakhs: 1.2,
      currentClass: 9,
      currentCourseLevel: 'Pre-Matric',
      institutionName: 'Govt. Tribal High School, Khunti',
      hostellerStatus: false,
      aadhaarLinkedBank: { bankName: 'State Bank of India', ifsc: 'SBIN0001234', isAadhaarSeeded: true },
      activeApplicationsCount: 1,
      totalDisbursedAmount: 3500
    }
  },
  student_postmatric: {
    user: {
      id: 'usr_postmatric_02',
      phone: '9876543211',
      role: 'student',
      name: 'Mangal Murmu',
      assignedState: 'Odisha',
      hasProfile: true
    },
    student: {
      id: 'stu_postmatric_02',
      name: 'Mangal Murmu',
      apaarId: '1001-2002-3004',
      category: 'ST',
      subTribe: 'Santhal',
      stateOfDomicile: 'Odisha',
      district: 'Mayurbhanj',
      annualIncomeLakhs: 1.8,
      currentClass: 12,
      currentCourseLevel: 'Post-Matric',
      institutionName: 'Govt. Polytechnic Institute, Baripada',
      hostellerStatus: true,
      aadhaarLinkedBank: { bankName: 'Bank of Baroda', isAadhaarSeeded: true },
      activeApplicationsCount: 1,
      totalDisbursedAmount: 13500
    }
  },
  student_topclass: {
    user: {
      id: 'usr_topclass_03',
      phone: '9876543212',
      role: 'student',
      name: 'Jaipal Singh Munda',
      assignedState: 'Maharashtra',
      hasProfile: true
    },
    student: {
      id: 'stu_topclass_03',
      name: 'Jaipal Singh Munda',
      apaarId: '1001-2002-3005',
      category: 'ST',
      subTribe: 'Munda',
      stateOfDomicile: 'Jharkhand',
      annualIncomeLakhs: 3.5,
      currentCourseLevel: 'Graduation',
      degreeName: 'B.Tech in Computer Science & Engineering',
      institutionName: 'Indian Institute of Technology (IIT) Bombay',
      aisheCode: 'U-0306',
      hostellerStatus: true,
      aadhaarLinkedBank: { bankName: 'Canara Bank', isAadhaarSeeded: true },
      activeApplicationsCount: 1,
      totalDisbursedAmount: 286000
    }
  },
  student_nfst: {
    user: {
      id: 'usr_nfst_04',
      phone: '9876543213',
      role: 'student',
      name: 'Shanti Oraon',
      assignedState: 'Delhi',
      hasProfile: true
    },
    student: {
      id: 'stu_nfst_04',
      name: 'Shanti Oraon',
      apaarId: '1001-2002-3006',
      category: 'ST',
      subTribe: 'Oraon',
      stateOfDomicile: 'Chhattisgarh',
      annualIncomeLakhs: 4.2,
      currentCourseLevel: 'Ph.D.',
      degreeName: 'Ph.D. in Tribal Linguistics & Cultural Studies',
      institutionName: 'Jawaharlal Nehru University (JNU), New Delhi',
      aisheCode: 'U-0109',
      hostellerStatus: true,
      aadhaarLinkedBank: { bankName: 'Punjab National Bank', isAadhaarSeeded: true },
      activeApplicationsCount: 1,
      totalDisbursedAmount: 420000
    }
  },
  student_nos: {
    user: {
      id: 'usr_nos_05',
      phone: '9876543214',
      role: 'student',
      name: 'Arjun Kharia',
      assignedState: 'International',
      hasProfile: true
    },
    student: {
      id: 'stu_nos_05',
      name: 'Arjun Kharia',
      apaarId: '1001-2002-3007',
      category: 'ST',
      subTribe: 'Kharia',
      stateOfDomicile: 'Odisha',
      annualIncomeLakhs: 2.8,
      currentCourseLevel: 'Post-Graduation',
      degreeName: 'M.Sc. in Renewable Energy Technologies',
      institutionName: 'University of Oxford, United Kingdom (QS Rank #3)',
      hostellerStatus: true,
      aadhaarLinkedBank: { bankName: 'State Bank of India Overseas Branch', isAadhaarSeeded: true },
      activeApplicationsCount: 1,
      totalDisbursedAmount: 1420000
    }
  },
  student_pvtg: {
    user: {
      id: 'usr_pvtg_06',
      phone: '9876543215',
      role: 'student',
      name: 'Sunita Birhor',
      assignedState: 'Jharkhand',
      hasProfile: true
    },
    student: {
      id: 'stu_pvtg_06',
      name: 'Sunita Birhor',
      apaarId: '1001-2002-3008',
      category: 'ST',
      subTribe: 'Birhor (PVTG)',
      isPvtg: true,
      stateOfDomicile: 'Jharkhand',
      annualIncomeLakhs: 0.8,
      currentCourseLevel: 'Graduation',
      degreeName: 'B.Sc. Nursing',
      institutionName: 'Ranchi University Medical College',
      hostellerStatus: true,
      aadhaarLinkedBank: { bankName: 'Jharkhand Gramin Bank', isAadhaarSeeded: true },
      activeApplicationsCount: 1,
      totalDisbursedAmount: 85000
    }
  },
  institute_nodal: {
    user: {
      id: 'usr_ino_07',
      phone: '9876543230',
      role: 'institute_nodal',
      name: 'Prof. Ramdas Meena',
      assignedAisheCode: 'U-0306',
      assignedState: 'Maharashtra',
      hasProfile: false
    },
    student: null
  },
  state_nodal: {
    user: {
      id: 'usr_sno_08',
      phone: '9876543240',
      role: 'state_nodal',
      name: 'Dr. B. K. Mohapatra (IAS)',
      assignedState: 'Odisha',
      hasProfile: false
    },
    student: null
  },
  mota_admin: {
    user: {
      id: 'usr_admin_09',
      phone: '9876543250',
      role: 'mota_admin',
      name: 'Smt. Anjali Sharma (Director, MoTA)',
      assignedState: 'All India',
      hasProfile: false
    },
    student: null
  }
};

export const MOCK_DOCUMENTS = [
  {
    id: 'doc_01',
    docType: 'ST_CERTIFICATE',
    docName: 'Scheduled Tribe Caste Certificate',
    issuer: 'State e-District Portal (Dept of Tribal Welfare)',
    issueDate: '2022-06-15',
    verified: true,
    verificationSource: 'DIGILOCKER_PKI',
    status: 'VERIFIED',
    pkiSignature: 'DIGILOCKER_CERT_VALIDATED_SHA256_e89a3f2b'
  },
  {
    id: 'doc_02',
    docType: 'INCOME_CERTIFICATE',
    docName: 'Annual Family Income Certificate (FY 2025-26)',
    issuer: 'Revenue Department / Tahsildar Office',
    issueDate: '2025-04-10',
    verified: true,
    verificationSource: 'STATE_EDISTRICT',
    status: 'VERIFIED',
    pkiSignature: 'EDISTRICT_REV_APPROVED_67cb9811'
  },
  {
    id: 'doc_03',
    docType: 'MARKSHEET_12TH',
    docName: 'Higher Secondary (Class XII) Marksheet',
    issuer: 'Central Board of Secondary Education (CBSE)',
    issueDate: '2024-05-20',
    verified: true,
    verificationSource: 'DIGILOCKER_PKI',
    status: 'VERIFIED',
    pkiSignature: 'CBSE_DIGILOCKER_SHA256_9941a3cd'
  },
  {
    id: 'doc_04',
    docType: 'INSTITUTE_BONAFIDE',
    docName: 'Bonafide Student Enrollment Certificate',
    issuer: 'Indian Institute of Technology (IIT) Bombay',
    issueDate: '2025-07-28',
    verified: true,
    verificationSource: 'AISHE_ADAPTER',
    status: 'VERIFIED',
    pkiSignature: 'IITB_REGISTRAR_AISHE_VALIDATED'
  }
];

export const MOCK_PAYMENTS = [
  {
    id: 'pay_01',
    financialYear: '2025-26',
    schemeCode: 'TOP_CLASS',
    schemeName: 'Top Class Education Scheme (IIT Bombay)',
    amount: 250000,
    component: 'Full Tuition Fee Reimbursement',
    status: 'DISBURSED',
    pfmsCreditStatus: 'SUCCESS (Bank Reference #PFMS2025091800421)',
    creditDate: '2025-09-18',
    bankAccountMasked: 'SBIN-XXXX-XXXX-4819'
  },
  {
    id: 'pay_02',
    financialYear: '2025-26',
    schemeCode: 'TOP_CLASS',
    schemeName: 'Top Class Education Scheme (Living Allowance Q1+Q2)',
    amount: 18000,
    component: 'Living Expenses Maintenance Allowance',
    status: 'DISBURSED',
    pfmsCreditStatus: 'SUCCESS (Bank Reference #PFMS2025091800422)',
    creditDate: '2025-09-18',
    bankAccountMasked: 'SBIN-XXXX-XXXX-4819'
  },
  {
    id: 'pay_03',
    financialYear: '2025-26',
    schemeCode: 'TOP_CLASS',
    schemeName: 'Top Class Education Scheme (Hardware Grant)',
    amount: 45000,
    component: 'One-Time Laptop & Computer Aid Grant',
    status: 'DISBURSED',
    pfmsCreditStatus: 'SUCCESS (Bank Reference #PFMS2025091800423)',
    creditDate: '2025-09-18',
    bankAccountMasked: 'SBIN-XXXX-XXXX-4819'
  }
];

export const MOCK_APPLICATIONS = [
  {
    id: 'app_top_2026_01',
    applicationNumber: 'MOTA/2026/TOP/84920',
    schemeCode: 'TOP_CLASS',
    schemeName: 'Top Class Education for ST Students',
    academicYear: '2026-27',
    status: 'STATE_VERIFIED',
    stageName: 'Ministry Final Sanction Queue',
    progressPercent: 75,
    submittedAt: '2026-08-14',
    totalClaimAmount: 336000,
    deficiencies: []
  }
];
