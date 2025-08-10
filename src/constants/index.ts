// Application constants
export const APP_CONFIG = {
  name: 'منصة الوافي للوظائف',
  description: 'منصة متقدمة لإدارة طلبات التوظيف',
  version: '1.0.0',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Public endpoints
  SUBMIT_APPLICATION: '/submissions/submit/job-application',
  
  // Auth endpoints
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  
  // Admin endpoints
  SUBMISSIONS: '/submissions',
  SUBMISSION_DETAILS: (id: string) => `/submissions/${id}`,
  UPDATE_STATUS: (id: string) => `/submissions/${id}/status`,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  AUTH_USER: 'authUser',
} as const;

// Form field names
export const FORM_FIELDS = {
  // Personal information
  FULL_NAME: 'fullName',
  NATIONAL_ID: 'nationalId',
  DATE_OF_BIRTH: 'dateOfBirth',
  NATIONALITY: 'nationality',
  MARITAL_STATUS: 'maritalStatus',
  
  // Contact information
  PHONE: 'phone',
  EMAIL: 'email',
  ADDRESS: 'address',
  
  // Education
  QUALIFICATION: 'qualification',
  MAJOR: 'major',
  GRADUATION_YEAR: 'graduationYear',
  
  // Work experience
  EXP_COMPANY: 'expCompany',
  EXP_POSITION: 'expPosition',
  EXP_DURATION: 'expDuration',
  EXP_REASON: 'expReason',
  
  // Company questions
  APPLIED_BEFORE: 'appliedBefore',
  APPLIED_BEFORE_WHEN: 'appliedBeforeWhen',
  RELATIVES_IN_COMPANY: 'relativesInCompany',
  RELATIVES_DETAILS: 'relativesDetails',
  
  // Signature
  APPLICANT_NAME: 'applicantName',
  DATE: 'date',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Status colors and text
export const STATUS_CONFIG = {
  1: { // Received
    text: 'مستلم',
    color: 'status-received',
    bgColor: 'bg-blue-500',
  },
  2: { // Under Review
    text: 'قيد المراجعة',
    color: 'status-underreview',
    bgColor: 'bg-yellow-500',
  },
  3: { // Approved
    text: 'مقبول',
    color: 'status-approved',
    bgColor: 'bg-green-500',
  },
  4: { // Rejected
    text: 'مرفوض',
    color: 'status-rejected',
    bgColor: 'bg-red-500',
  },
  5: { // On Hold
    text: 'معلق',
    color: 'status-onhold',
    bgColor: 'bg-orange-500',
  },
  6: { // Processed
    text: 'تمت المعالجة',
    color: 'status-processed',
    bgColor: 'bg-purple-500',
  },
} as const;

// Validation patterns
export const VALIDATION = {
  PHONE_PATTERN: /^[0-9+\-\s()]{10,}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NATIONAL_ID_PATTERN: /^[0-9]{10}$/,
} as const;

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ],
  MAX_FILES: 5,
} as const;

// Toast notification settings
export const TOAST_CONFIG = {
  DURATION: {
    SUCCESS: 3000,
    ERROR: 4000,
    INFO: 3000,
    WARNING: 4000,
  },
  POSITION: 'top-center',
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  SUBMISSIONS: 'submissions',
  SUBMISSION: 'submission',
  DASHBOARD_STATS: 'dashboardStats',
  USER_PROFILE: 'userProfile',
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;
