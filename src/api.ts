  // src/api.ts
  import axios from "axios";

  const API = axios.create({
    baseURL: "http://localhost:8080", // Spring Boot backend
    timeout: 10000, // 10 second timeout
  });

  // Add token to headers if available  
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor for error handling
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  // Auth API
  export const authAPI = {
    login: (data: { username: string; password: string; otp?: string }) =>
      API.post("/api/auth/login", data),
    
    adminLogin: (data: { username: string; password: string; otp?: string }) =>
      API.post("/api/auth/admin/login", data),
    
    signup: (data: { 
      username: string; 
      email: string; 
      fullName: string; 
      phone: string; 
      password: string; 
      role: string;
    }) => API.post("/api/auth/signup", data),
    
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("companyInfo");
    }
  };

  // Candidate API
  export const candidateAPI = {
    verifyContact: (data: { searchType: string; searchValue: string }) =>
      API.post("/api/candidate/verify", data),
    
    submitReport: (formData: FormData) =>
      API.post("/api/candidate/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    
    getReports: () => API.get("/api/candidate/reports")
  };

  // Company API
  export const companyAPI = {
    // Company Profile
    createProfile: (data: {
      name: string;
      website: string;
      industry: string;
      size: string;
      description: string;
    }) => API.post("/api/company/profile", data),
    
    getProfile: () => API.get("/api/company/profile"),
    
    updateProfile: (data: {
      name?: string;
      website?: string;
      industry?: string;
      size?: string;
      description?: string;
    }) => API.put("/api/company/profile", data),

    // HR Contacts
    getHRContacts: () => API.get("/api/company/hr-contacts"),
    
    addHRContact: (data: {
      name: string;
      email: string;
      phone?: string;
      department?: string;
      title?: string;
    }) => API.post("/api/company/hr-contacts", data),
    
    deleteHRContact: (id: number) => API.delete(`/api/company/hr-contacts/${id}`),
    
    deleteHRContactByDetails: (data: {
      name: string;
      email?: string;
      phone?: string;
    }) => API.delete("/api/company/hr-contacts/by-details", { data }),
    
    // Bulk Operations
    bulkAddHRContacts: (formData: FormData) =>
      API.post("/api/company/hr-contacts/bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    
    bulkDeleteHRContacts: (formData: FormData) =>
      API.post("/api/company/hr-contacts/bulk-delete", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    // Reported Contacts
    getReportedContacts: () => API.get("/api/company/reported-contacts"),
  };

  // Admin API - Updated with complete endpoints
  export const adminAPI = {
    // Dashboard
    getDashboardStats: () => API.get("/api/admin/dashboard/stats"),
    
    // Companies Management
    getCompanies: (status?: string) => 
      API.get(`/api/admin/companies${status && status !== 'all' ? `?status=${status.toUpperCase()}` : ''}`),
    
    approveCompany: (companyId: string) => 
      API.post(`/api/admin/companies/${companyId}/approve`),
    
    rejectCompany: (companyId: string) => 
      API.post(`/api/admin/companies/${companyId}/reject`),

    // HR Contacts Management
    getAllHRContacts: () => API.get("/api/admin/hr-contacts"),
    
    updateHRStatus: (contactId: string, status: string) => 
      API.put(`/api/admin/hr-contacts/${contactId}/status?status=${status.toUpperCase()}`),

    // HR Contacts CRUD Operations
    createHRContact: (data: {
      name: string;
      email: string;
      phone?: string;
      department?: string;
      title?: string;
      company?: string;
    }) => API.post("/api/admin/hr-contacts", data),
    
    deleteHRContact: (contactId: string) => 
      API.delete(`/api/admin/hr-contacts/${contactId}`),
    
    // HR Contacts Bulk Operations
    bulkAddHRContacts: (contacts: any[]) => 
      API.post("/api/admin/hr-contacts/bulk", contacts),
    
    bulkDeleteHRContacts: (contactIds: string[]) => 
      API.delete("/api/admin/hr-contacts/bulk", { data: contactIds }),

    // Reports Management
    getAllReports: (status?: string) => 
      API.get(`/api/admin/reports${status ? `?status=${status}` : ''}`),
    
    updateReportStatus: (reportId: number, status: string) => 
      API.put(`/api/admin/reports/${reportId}/status?status=${status}`),

    // Candidates Management
    getCandidates: () => API.get("/api/admin/candidates"),
    
    updateCandidateStatus: (candidateId: number, preferred: boolean) => 
      API.put(`/api/admin/candidates/${candidateId}/preferred?preferred=${preferred}`),
  };

  // User API (common for all roles)
  export const userAPI = {
    getProfile: () => API.get("/api/user/profile"),
    
    updateProfile: (data: {
      fullName?: string;
      phone?: string;
      email?: string;
    }) => API.put("/api/user/profile", data),
    
    changePassword: (data: {
      currentPassword: string;
      newPassword: string;
    }) => API.put("/api/user/change-password", data),
  };

  // File Upload API
  export const fileAPI = {
    uploadDocument: (formData: FormData) =>
      API.post("/api/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    
    uploadImage: (formData: FormData) =>
      API.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  };

  // Types for better TypeScript support
  export interface Company {
    id: string;
    name: string;
    website: string;
    industry: string;
    size?: string;
    description?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedDate: string;
    hrContacts: number;
  }

  export interface HRContact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    title?: string;
    company?: string;
    status: 'ACTIVE' | 'SUSPENDED';
    verifiedDate: string;
    reported?: boolean;
  }

  export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone?: string;
    skills?: string;
    preferred?: boolean;
  }

  export interface AdminStats {
    totalCompanies: number;
    pendingApprovals: number;
    totalContacts: number;
    flaggedReports: number;
  }

  export interface RecentActivity {
    id: string;
    action: string;
    company: string;
    timestamp: string;
    type: 'REGISTRATION' | 'VERIFICATION' | 'REPORT' | 'APPROVAL';
  }

  // Enhanced Admin API with typed responses
  export const typedAdminAPI = {
    // Dashboard
    getDashboardStats: (): Promise<{ data: AdminStats }> => 
      API.get("/api/admin/dashboard/stats"),
    
    // Companies Management
    getCompanies: (status?: string): Promise<{ data: Company[] }> => 
      API.get(`/api/admin/companies${status && status !== 'all' ? `?status=${status.toUpperCase()}` : ''}`),
    
    approveCompany: (companyId: string): Promise<{ data: Company }> => 
      API.post(`/api/admin/companies/${companyId}/approve`),
    
    rejectCompany: (companyId: string): Promise<{ data: Company }> => 
      API.post(`/api/admin/companies/${companyId}/reject`),

    // HR Contacts Management
    getAllHRContacts: (): Promise<{ data: HRContact[] }> => 
      API.get("/api/admin/hr-contacts"),
    
    updateHRStatus: (contactId: string, status: string): Promise<{ data: HRContact }> => 
      API.put(`/api/admin/hr-contacts/${contactId}/status?status=${status.toUpperCase()}`),

    // HR Contacts CRUD Operations
    createHRContact: (data: {
      name: string;
      email: string;
      phone?: string;
      department?: string;
      title?: string;
      company?: string;
    }): Promise<{ data: HRContact }> => 
      API.post("/api/admin/hr-contacts", data),
    
    deleteHRContact: (contactId: string): Promise<void> => 
      API.delete(`/api/admin/hr-contacts/${contactId}`),
    
    // HR Contacts Bulk Operations
    bulkAddHRContacts: (contacts: any[]): Promise<{ data: HRContact[] }> => 
      API.post("/api/admin/hr-contacts/bulk", contacts),
    
    bulkDeleteHRContacts: (contactIds: string[]): Promise<void> => 
      API.delete("/api/admin/hr-contacts/bulk", { data: contactIds }),

    // Candidates Management
    getCandidates: (): Promise<{ data: Candidate[] }> => 
      API.get("/api/admin/candidates"),
    
    updateCandidateStatus: (candidateId: string, preferred: boolean): Promise<{ data: Candidate }> => 
      API.put(`/api/admin/candidates/${candidateId}/preferred?preferred=${preferred}`),
  };

  // Utility functions
  export const apiUtils = {
    // Handle API errors consistently
    handleError: (error: any): string => {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.response?.data) {
        return typeof error.response.data === 'string' 
          ? error.response.data 
          : 'An error occurred';
      }
      if (error.message) {
        return error.message;
      }
      return 'Network error occurred. Please try again.';
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
      return !!localStorage.getItem("token");
    },

    // Get current user role
    getUserRole: (): string | null => {
      return localStorage.getItem("userType");
    },

    // Check if user has specific role
    hasRole: (role: string): boolean => {
      return localStorage.getItem("userType") === role;
    },

    // Admin role check
    isAdmin: (): boolean => {
      return localStorage.getItem("userType") === 'ADMIN';
    },

    // Company role check
    isCompany: (): boolean => {
      return localStorage.getItem("userType") === 'COMPANY';
    },

    // Candidate role check
    isCandidate: (): boolean => {
      return localStorage.getItem("userType") === 'CANDIDATE';
    }
  };

  // Export for use in components
  export default API;