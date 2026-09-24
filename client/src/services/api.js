import axios from 'axios';
import { 
  MOCK_SCHEMES, 
  MOCK_PERSONAS, 
  MOCK_DOCUMENTS, 
  MOCK_PAYMENTS, 
  MOCK_APPLICATIONS 
} from './mockData.js';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

// Helper for client-side local storage persistence in static/demo mode
const getLocalState = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(`janjatisetu_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocalState = (key, val) => {
  try {
    localStorage.setItem(`janjatisetu_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

// Safe request wrapper that tries the backend first and falls back to mockData
const safeCall = async (realCall, mockFallback) => {
  try {
    const res = await realCall();
    return res;
  } catch (err) {
    // If backend is not available (404, network error, timeout, static Vercel deployment)
    if (!err.response || err.response.status === 404 || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
      const mockResult = await mockFallback();
      return { data: mockResult, status: 200, statusText: 'OK', config: {}, headers: {} };
    }
    throw err;
  }
};

export const authAPI = {
  sendOtp: (phone) => 
    safeCall(
      () => api.post('/auth/send-otp', { phone }),
      () => ({
        success: true,
        message: `OTP dispatched to +91-${phone.slice(0, 2)}******${phone.slice(-2)}`,
        devOtp: '123456'
      })
    ),

  verifyOtp: (payload) =>
    safeCall(
      () => api.post('/auth/verify-otp', payload),
      () => {
        const persona = MOCK_PERSONAS.student_topclass;
        setLocalState('current_user', persona.user);
        setLocalState('current_student', persona.student);
        return {
          success: true,
          accessToken: 'mock_jwt_token_janjatisetu_2026',
          user: persona.user,
          student: persona.student
        };
      }
    ),

  demoLogin: (demoRole) =>
    safeCall(
      () => api.post('/auth/demo-login', { demoRole }),
      () => {
        const persona = MOCK_PERSONAS[demoRole] || MOCK_PERSONAS.student_topclass;
        setLocalState('current_user', persona.user);
        setLocalState('current_student', persona.student);
        return {
          success: true,
          message: `Logged in as Demo Persona: ${persona.user.name}`,
          accessToken: 'mock_jwt_token_janjatisetu_2026',
          user: persona.user,
          student: persona.student
        };
      }
    ),

  logout: () =>
    safeCall(
      () => api.post('/auth/logout'),
      () => {
        localStorage.removeItem('janjatisetu_current_user');
        localStorage.removeItem('janjatisetu_current_student');
        return { success: true };
      }
    ),

  getMe: () =>
    safeCall(
      () => api.get('/auth/me'),
      () => {
        const user = getLocalState('current_user', MOCK_PERSONAS.student_topclass.user);
        const student = getLocalState('current_student', MOCK_PERSONAS.student_topclass.student);
        return {
          success: true,
          user,
          student
        };
      }
    ),
};

export const profileAPI = {
  getProfile: () => 
    safeCall(
      () => api.get('/profile'),
      () => ({ success: true, student: getLocalState('current_student', MOCK_PERSONAS.student_topclass.student) })
    ),
  updateProfile: (data) =>
    safeCall(
      () => api.put('/profile', data),
      () => {
        const current = getLocalState('current_student', MOCK_PERSONAS.student_topclass.student);
        const updated = { ...current, ...data };
        setLocalState('current_student', updated);
        return { success: true, student: updated };
      }
    ),
  getGuardianWards: () =>
    safeCall(
      () => api.get('/profile/guardian/wards'),
      () => ({
        success: true,
        wards: [
          MOCK_PERSONAS.student_prematric.student,
          MOCK_PERSONAS.student_topclass.student
        ]
      })
    ),
  linkGuardianWard: (payload) =>
    safeCall(
      () => api.post('/profile/guardian/link', payload),
      () => ({ success: true, message: 'Ward linked successfully via DigiLocker e-KYC' })
    ),
};

export const schemeAPI = {
  getAll: () =>
    safeCall(
      () => api.get('/schemes'),
      () => ({ success: true, count: MOCK_SCHEMES.length, schemes: MOCK_SCHEMES })
    ),
  getByCode: (code) =>
    safeCall(
      () => api.get(`/schemes/${code}`),
      () => ({ success: true, scheme: MOCK_SCHEMES.find(s => s.code === code) || MOCK_SCHEMES[0] })
    ),
  updateConfig: (code, data) =>
    safeCall(
      () => api.put(`/schemes/${code}`, data),
      () => ({ success: true, message: 'Scheme updated', scheme: { ...MOCK_SCHEMES[0], ...data, version: 2 } })
    ),
  getInstitutions: (params) =>
    safeCall(
      () => api.get('/institutions', { params }),
      () => ({
        success: true,
        institutions: [
          { aisheCode: 'U-0306', name: 'Indian Institute of Technology (IIT) Bombay', category: 'IIT', state: 'Maharashtra', isPremier: true },
          { aisheCode: 'U-0109', name: 'Jawaharlal Nehru University (JNU), New Delhi', category: 'Central University', state: 'Delhi', isPremier: true },
          { aisheCode: 'U-0220', name: 'Indian Institute of Management (IIM) Ahmedabad', category: 'IIM', state: 'Gujarat', isPremier: true },
          { aisheCode: 'U-0500', name: 'All India Institute of Medical Sciences (AIIMS) New Delhi', category: 'AIIMS', state: 'Delhi', isPremier: true }
        ]
      })
    ),
};

export const applicationAPI = {
  getDashboardSummary: () =>
    safeCall(
      () => api.get('/applications/dashboard/summary'),
      () => ({
        success: true,
        totalApplications: 1,
        activeApplications: 1,
        totalDisbursedAmount: 313000,
        pendingActionsCount: 0,
        applications: MOCK_APPLICATIONS
      })
    ),
  checkEligibility: (schemeCode) =>
    safeCall(
      () => api.get('/applications/eligibility/check', { params: schemeCode ? { schemeCode } : {} }),
      () => ({
        success: true,
        eligible: true,
        schemeCode: schemeCode || 'TOP_CLASS',
        matchedCriteria: ['ST Tribe Verified', 'AISHE Institute Empanelled', 'Income within limit', 'Conflict Free'],
        estimatedEntitlement: {
          tuitionFee: 250000,
          livingAllowance: 36000,
          bookGrant: 5000,
          laptopGrant: 45000,
          total: 336000
        }
      })
    ),
  getApplications: () =>
    safeCall(
      () => api.get('/applications'),
      () => ({ success: true, applications: MOCK_APPLICATIONS })
    ),
  getApplicationById: (id) =>
    safeCall(
      () => api.get(`/applications/${id}`),
      () => ({ success: true, application: MOCK_APPLICATIONS[0] })
    ),
  saveDraft: (payload) =>
    safeCall(
      () => api.post('/applications/draft', payload),
      () => ({ success: true, applicationNumber: 'MOTA/2026/DRAFT/' + Math.floor(10000 + Math.random() * 90000) })
    ),
  submit: (id, payload) =>
    safeCall(
      () => api.post(`/applications/${id}/submit`, payload || {}),
      () => ({ success: true, message: 'Application submitted successfully to Institutional Nodal Officer (INO).' })
    ),
  resolveDeficiency: (id, payload) =>
    safeCall(
      () => api.post(`/applications/${id}/deficiency/resolve`, payload),
      () => ({ success: true, message: 'Deficiency resolved.' })
    ),
};

export const walletAPI = {
  getDocuments: () =>
    safeCall(
      () => api.get('/wallet'),
      () => ({ success: true, documents: MOCK_DOCUMENTS })
    ),
  fetchDigiLocker: () =>
    safeCall(
      () => api.post('/wallet/digilocker-fetch'),
      () => ({ success: true, message: '4 official government documents fetched from DigiLocker PKI.', documents: MOCK_DOCUMENTS })
    ),
  uploadDocument: (data) =>
    safeCall(
      () => api.post('/wallet/upload', data),
      () => ({ success: true, document: { id: 'doc_' + Date.now(), docName: 'Uploaded Document', verified: true, status: 'VERIFIED' } })
    ),
  verifyDocument: (id) =>
    safeCall(
      () => api.post(`/wallet/${id}/verify`),
      () => ({ success: true, message: 'Document verified via PKI adapter.' })
    ),
  getReviewQueue: () =>
    safeCall(
      () => api.get('/wallet/review-queue'),
      () => ({ success: true, queue: [] })
    ),
  resolveReview: (id, data) =>
    safeCall(
      () => api.post(`/wallet/review-queue/${id}/resolve`, data),
      () => ({ success: true })
    ),
};

export const paymentAPI = {
  getPayments: () =>
    safeCall(
      () => api.get('/payments'),
      () => ({ success: true, payments: MOCK_PAYMENTS, totalDisbursed: 313000 })
    ),
};

export const notificationAPI = {
  getNotifications: () =>
    safeCall(
      () => api.get('/notifications'),
      () => ({
        success: true,
        notifications: [
          { id: 'notif_1', title: 'PFMS DBT Sanction Approved', message: '₹3,36,000 sanctioned for Academic Year 2026-27 under Top Class Education Scheme.', timestamp: '2026-09-20T10:00:00Z', read: false },
          { id: 'notif_2', title: 'DigiLocker e-KYC Verified', message: 'ST Caste Certificate and Income Certificate verified successfully with Zero Paperwork.', timestamp: '2026-09-18T14:30:00Z', read: true }
        ]
      })
    ),
  markAsRead: (id) =>
    safeCall(
      () => api.patch(`/notifications/${id}/read`),
      () => ({ success: true })
    ),
  markAllAsRead: () =>
    safeCall(
      () => api.patch('/notifications/read-all'),
      () => ({ success: true })
    ),
};

export const grievanceAPI = {
  raiseGrievance: (data) =>
    safeCall(
      () => api.post('/grievances', data),
      () => ({ success: true, ticketNumber: 'GRV/2026/MOTA/' + Math.floor(10000 + Math.random() * 90000), message: 'Grievance registered with MoTA Nodal Desk.' })
    ),
  getGrievances: () =>
    safeCall(
      () => api.get('/grievances'),
      () => ({
        success: true,
        grievances: [
          { id: 'grv_1', ticketNumber: 'GRV/2026/TOP/1042', subject: 'Aadhaar APBS Bank Seeding Verification', status: 'RESOLVED', resolution: 'Aadhaar mapper refreshed with Canara Bank APBS ledger.', createdAt: '2026-08-20' }
        ]
      })
    ),
  getGrievanceById: (id) =>
    safeCall(
      () => api.get(`/grievances/${id}`),
      () => ({ success: true, grievance: { id, ticketNumber: 'GRV/2026/TOP/1042', status: 'RESOLVED' } })
    ),
  escalateGrievance: (id) =>
    safeCall(
      () => api.post(`/grievances/${id}/escalate`),
      () => ({ success: true, message: 'Ticket escalated to Joint Secretary, Ministry of Tribal Affairs.' })
    ),
};

export const jagoAPI = {
  query: (data) =>
    safeCall(
      () => api.post('/jago/query', data),
      () => {
        const query = (data.query || '').toLowerCase();
        let response = 'जोहार! (Johar!) I am JAGO, your multilingual AI Assistant for Ministry of Tribal Affairs scholarships. How may I assist your educational journey today?';
        if (query.includes('laptop') || query.includes('computer')) {
          response = 'Under the Top Class Education Scheme for ST Students admitted to 246 premier institutions (IITs, IIMs, AIIMS, NITs, NLUs), a one-time grant of ₹45,000 is provided for purchasing a computer/laptop with accessories.';
        } else if (query.includes('income') || query.includes('eligibility')) {
          response = 'Pre-Matric & Post-Matric have an annual family income ceiling of ₹2.50 Lakh. Top Class Education & National Overseas Scholarship (NOS) have an income limit of ₹6.00 Lakh. National Fellowship (NFST) has NO income ceiling (purely merit-based).';
        } else if (query.includes('fellowship') || query.includes('nfst')) {
          response = 'National Fellowship for ST Students (NFST) awards 750 fellowships annually for regular M.Phil/Ph.D. programs: ₹31,000/month JRF, ₹35,000/month SRF + HRA + contingency grants.';
        } else if (query.includes('overseas') || query.includes('nos')) {
          response = 'National Overseas Scholarship (NOS) supports 20 ST scholars annually for Master’s/Ph.D. in Top 500 QS World Universities with full tuition, return airfare, and annual living allowance of USD 15,400 (USA) or GBP 9,900 (UK).';
        }
        return {
          success: true,
          response,
          culturalGreeting: 'जोहार (Johar)',
          suggestedActions: ['Check 5 MoTA Schemes', 'Open DigiLocker Vault', 'Allowance Calculator']
        };
      }
    ),
  getSuggestions: () =>
    safeCall(
      () => api.get('/jago/suggestions'),
      () => ({
        success: true,
        suggestions: [
          'What is the ₹45,000 laptop grant under Top Class Scheme?',
          'What are the JRF/SRF stipend rates under NFST Fellowship?',
          'How does DigiLocker e-KYC work for ST caste certificate?',
          'What is the income limit for National Overseas Scholarship?'
        ]
      })
    ),
  getKnowledge: () =>
    safeCall(
      () => api.get('/jago/knowledge'),
      () => ({ success: true, schemes: MOCK_SCHEMES })
    ),
};

export const officerAPI = {
  getDashboard: () =>
    safeCall(
      () => api.get('/officer/dashboard'),
      () => ({
        success: true,
        pendingReviewCount: 12,
        verifiedCount: 148,
        sanctionedCount: 92,
        totalFundsDisbursed: 142000000,
        coverageGapSummary: { totalIdentifiedST: 12400, coveredCount: 9600, gapCount: 2800 }
      })
    ),
  getApplications: (params) =>
    safeCall(
      () => api.get('/officer/applications', { params }),
      () => ({ success: true, applications: MOCK_APPLICATIONS, total: 1 })
    ),
  batchAction: (data) =>
    safeCall(
      () => api.post('/officer/batch-action', data),
      () => ({ success: true, message: 'Batch processed successfully for selected ST applications.' })
    ),
  generateSanctionOrder: (data) =>
    safeCall(
      () => api.post('/officer/sanction-order', data),
      () => ({ success: true, sanctionOrderNumber: 'MOTA/SANCTION/2026/ALL/' + Math.floor(1000 + Math.random() * 9000), totalSanctionedAmount: 1420000 })
    ),
  generatePfmsDbtBatch: (data) =>
    safeCall(
      () => api.post('/officer/pfms-dbt-batch', data),
      () => ({ success: true, batchId: 'PFMS-APBS-' + Math.floor(10000000 + Math.random() * 90000000), totalRecords: 48, status: 'PROCESSED' })
    ),
  getCoverageGap: (state) =>
    safeCall(
      () => api.get('/officer/coverage-gap', { params: state ? { state } : {} }),
      () => ({
        success: true,
        state: state || 'All States',
        districts: [
          { district: 'Mayurbhanj (Odisha)', stPopulation: 84000, enrolledST: 38000, availingScholarship: 29000, gapCount: 9000, saturationRate: '76.3%' },
          { district: 'Khunti (Jharkhand)', stPopulation: 62000, enrolledST: 28000, availingScholarship: 23500, gapCount: 4500, saturationRate: '83.9%' },
          { district: 'Bastar (Chhattisgarh)', stPopulation: 95000, enrolledST: 41000, availingScholarship: 29500, gapCount: 11500, saturationRate: '71.9%' }
        ]
      })
    ),
};

export default api;
