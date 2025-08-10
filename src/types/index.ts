// Enums
export enum SubmissionStatus {
  Received = 1,
  UnderReview = 2,
  Approved = 3,
  Rejected = 4,
  OnHold = 5,
  Processed = 6,
}

export enum MaritalStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed',
}

  // Work Experience Type (Optional fields)
export interface WorkExperience {
  expCompany?: string;
  expPosition?: string;
  expDuration?: string;
  expReason?: string;
}

// Form Data Types
export interface JobApplicationFormData {
  // Personal Information (All Required)
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;

  // Contact Information (All Required)
  phone: string;
  email: string;
  address: string;

  // Education (Optional)
  qualification?: string;
  major?: string;
  graduationYear?: string;

  // Work Experience (Array - Optional)
  workExperiences?: WorkExperience[];

  // Company Related Questions (Required)
  appliedBefore: string;
  appliedBeforeWhen?: string;
  relativesInCompany: string;
  relativesDetails?: string;

  // Signature Information (Required)
  applicantName: string;
  signature: string;
}

// API Response Types
export interface SubmitFormResponse {
  submissionId: string;
  referenceCode: string;
  message: string;
}

export interface SubmissionFilterDto {
  formKey?: string;
  status?: SubmissionStatus;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SubmissionListDto {
  id: string;
  formKey: string;
  createdAt: Date;
  status: SubmissionStatus;
  referenceCode: string;
  formData: JobApplicationFormData;
  filesCount: number;
  hasSignature: boolean;
}

export interface SubmissionFileDto {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  downloadUrl: string;
}

export interface SubmissionSignatureDto {
  id: string;
  signatureType: string;
  createdAt: Date;
  signatureData: string;
}

export interface SubmissionDetailDto extends SubmissionListDto {
  adminNotes?: string;
  files: SubmissionFileDto[];
  signatures: SubmissionSignatureDto[];
}

export interface UpdateStatusRequest {
  status: SubmissionStatus;
  adminNotes?: string;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

// Dashboard Stats
export interface DashboardStats {
  totalApplications: number;
  receivedCount: number;
  underReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  todayApplications: number;
  weeklyApplications: number;
}
