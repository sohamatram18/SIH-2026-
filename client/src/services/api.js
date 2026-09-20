import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle transparent token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.post('/api/v1/auth/refresh-token', {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshErr) {
        // Refresh token failed, redirect to login
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOtp: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (payload) => api.post('/auth/verify-otp', payload),
  demoLogin: (demoRole) => api.post('/auth/demo-login', { demoRole }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getGuardianWards: () => api.get('/profile/guardian/wards'),
  linkGuardianWard: (payload) => api.post('/profile/guardian/link', payload),
};

export const schemeAPI = {
  getAll: () => api.get('/schemes'),
  getByCode: (code) => api.get(`/schemes/${code}`),
  updateConfig: (code, data) => api.put(`/schemes/${code}`, data),
  getInstitutions: (params) => api.get('/institutions', { params }),
};

export const applicationAPI = {
  getDashboardSummary: () => api.get('/applications/dashboard/summary'),
  checkEligibility: (schemeCode) => api.get('/applications/eligibility/check', { params: schemeCode ? { schemeCode } : {} }),
  getApplications: () => api.get('/applications'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  saveDraft: (payload) => api.post('/applications/draft', payload),
  submit: (id, payload) => api.post(`/applications/${id}/submit`, payload || {}),
  resolveDeficiency: (id, payload) => api.post(`/applications/${id}/deficiency/resolve`, payload),
};

export const walletAPI = {
  getDocuments: () => api.get('/wallet'),
  fetchDigiLocker: () => api.post('/wallet/digilocker-fetch'),
  uploadDocument: (data) => api.post('/wallet/upload', data),
  verifyDocument: (id) => api.post(`/wallet/${id}/verify`),
  getReviewQueue: () => api.get('/wallet/review-queue'),
  resolveReview: (id, data) => api.post(`/wallet/review-queue/${id}/resolve`, data),
};

export const paymentAPI = {
  getPayments: () => api.get('/payments'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export const grievanceAPI = {
  raiseGrievance: (data) => api.post('/grievances', data),
  getGrievances: () => api.get('/grievances'),
  getGrievanceById: (id) => api.get(`/grievances/${id}`),
  escalateGrievance: (id) => api.post(`/grievances/${id}/escalate`),
};

export const jagoAPI = {
  query: (data) => api.post('/jago/query', data),
  getSuggestions: () => api.get('/jago/suggestions'),
  getKnowledge: () => api.get('/jago/knowledge'),
};

export const officerAPI = {
  getDashboard: () => api.get('/officer/dashboard'),
  getApplications: (params) => api.get('/officer/applications', { params }),
  batchAction: (data) => api.post('/officer/batch-action', data),
  generateSanctionOrder: (data) => api.post('/officer/sanction-order', data),
  generatePfmsDbtBatch: (data) => api.post('/officer/pfms-dbt-batch', data),
  getCoverageGap: (state) => api.get('/officer/coverage-gap', { params: state ? { state } : {} }),
};

export default api;
