export interface User {
  id: string;
  walletAddress: string;
  userType: "PATIENT" | "DOCTOR";
  fullName: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  location: string;
  verified: boolean;
  bio?: string;
  education?: string;
  availability?: any[];
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  specialty: string;
  licenseNumber: string;
  yearsExperience: number;
  education: string;
  bio?: string;
  consultationFee: number;
  rating: number;
  totalConsultations: number;
  languages: string[];
  availability: TimeSlot[];
  user: User;
}

export interface TimeSlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: Date;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  type: "VIDEO" | "CHAT";
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  fee: number;
  transactionHash?: string;
  patient: Patient;
  doctor: DoctorProfile;
  messages: Message[];
}

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  timestamp: Date;
  encrypted: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  consultationId?: string;
  title: string;
  description: string;
  recordType:
    | "CONSULTATION"
    | "LAB_RESULT"
    | "PRESCRIPTION"
    | "IMAGING"
    | "OTHER";
  fileUrl?: string;
  ipfsHash?: string;
  createdAt: Date;
  patient: Patient;
}

export interface AITriageResult {
  suggestedSpecialty: string;
  urgencyLevel: "low" | "medium" | "high" | "emergency";
  recommendedDoctors: Doctor[];
  reasoning: string;
}

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (walletAddress: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export type OnboardingData = {
  userType: "DOCTOR" | "PATIENT";
  name: string;
  email: string;
  password: string;
  // Doctor specific fields
  specialty?: string;
  experience?: number;
  location?: string;
  bio?: string;
  education?: string;
  consultationFee?: number;
  // Patient specific fields
  dateOfBirth?: Date;
  gender?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
};

export interface DoctorOnboardingProps {
  initialData?: Partial<OnboardingData>;
  onComplete: (data: OnboardingData) => Promise<void>;
  isLoading?: boolean;
}

export interface PatientOnboardingProps {
  initialData?: Partial<OnboardingData>;
  onComplete: (data: OnboardingData) => Promise<void>;
  isLoading?: boolean;
}

export interface Session {
  id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  paymentAmount: number;
  paymentStatus: 'PENDING' | 'COMPLETED';
  notes?: string;
}
