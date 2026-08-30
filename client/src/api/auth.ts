import axios from 'axios';

// Uses VITE_API_URL (or VITE_API_BASE_URL) set on Vercel, falling back to localhost for local dev
const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cross-origin session/cookies on Vercel
});

// Automatically inject Authorization Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobizza_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Endpoints
export const authApi = {
  // Initiate email OTP flow
  loginManual: async (email: string, role: string) => {
    const response = await api.post('/auth/manual', { email, role });
    return response.data;
  },

  // Verify OTP code
  verifyOtp: async (email: string, otp: string, role: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp, role });
    if (response.data.success && response.data.token) {
      localStorage.setItem('jobizza_token', response.data.token);
    }
    return response.data;
  },

  // Resend verification OTP
  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  // Complete profile onboarding
  completeProfile: async (profileData: {
    name?: string;
    company: string;
    position: string;
    city: string;
    pincode: string;
    linkedin: string;
    dob?: string;
  }) => {
    const response = await api.post('/auth/complete-profile', profileData);
    return response.data;
  },

  // Get current logged-in user profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout utility
  logout: () => {
    localStorage.removeItem('jobizza_token');
  },
};

export const adminApi = {
  // Get all members (admins only)
  getMembers: async (params?: { status?: string; role?: string; q?: string }) => {
    const response = await api.get('/admin/members', { params });
    return response.data;
  },

  // Approve/reject pending member
  updateMemberStatus: async (id: string, status: 'accepted' | 'rejected') => {
    const response = await api.patch(`/admin/members/${id}/status`, { status });
    return response.data;
  },

  // Toggle admin/member roles (main admin only)
  updateMemberRole: async (id: string, role: 'admin' | 'member') => {
    const response = await api.patch(`/admin/members/${id}/role`, { role });
    return response.data;
  },
};
// Add /api to the base URL explicitly if missing
const rawUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const teamApi = {
  getTeam: async () => {
    const response = await api.get('/team');
    return response.data;
  },
  addTeamMember: async (data: { name: string; role: string; position?: string; image?: string; linkedinUrl?: string; order?: number }) => {
    const response = await api.post('/team', data);
    return response.data;
  },
  updateTeamMember: async (id: string, data: { name?: string; role?: string; position?: string; image?: string; linkedinUrl?: string; order?: number }) => {
    const response = await api.put(`/team/${id}`, data);
    return response.data;
  },
  deleteTeamMember: async (id: string) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },
};

export default api;