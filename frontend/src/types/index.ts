// Common Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'jobseeker' | 'employer' | 'admin';
  phone?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}

export interface Salary {
  min: number;
  max: number;
  currency?: string;
}

// Job Types
export interface Job {
  _id: string;
  title: string;
  description: string;
  company: Company | string;
  location: Location;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  salary?: Salary;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  status: 'active' | 'closed' | 'draft';
  applicants?: number;
  views?: number;
  postedBy: User | string;
  postedDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Company Types
export interface Company {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  location: Location;
  industry: string;
  size: string;
  founded?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Application Types
export interface Application {
  _id: string;
  job: Job | string;
  jobseeker: User | string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';
  resume: string;
  coverLetter?: string;
  notes?: string;
  appliedDate?: string;
  viewedAt?: string;
  interviewDate?: string;
  interviewDetails?: {
    date: string;
    time: string;
    location?: string;
    meetingLink?: string;
  };
  statusUpdatedAt?: string;
  shortlistedAt?: string;
  interviewScheduledAt?: string;
  decidedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Profile Types
export interface JobSeekerProfile extends User {
  headline?: string;
  bio?: string;
  location?: Location;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications?: Certification[];
  portfolio?: string;
  resume?: string;
  profileViews?: number;
  applicationsCount?: number;
  savedJobsCount?: number;
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

// Redux State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  recommendedJobs: Job[];
  savedJobs: Job[];
  isLoading: boolean;
  error: string | null;
}

export interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  isLoading: boolean;
  error: string | null;
}

export interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserState {
  profile: JobSeekerProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  jobs: JobState;
  applications: ApplicationState;
  companies: CompanyState;
  user: UserState;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Component Props Types
export interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'slideIn';
  className?: string;
  hover?: boolean;
}

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  shadow?: boolean;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'jobseeker' | 'employer';
}

export interface JobFormData {
  title: string;
  description: string;
  company: string;
  location: Location;
  jobType: string;
  experienceLevel: string;
  salary?: Salary;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
}

export interface ApplicationFormData {
  resume: File | string;
  coverLetter?: string;
}
