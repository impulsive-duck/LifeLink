export interface SignupRequest {
  hospitalName: string;
  licenseNumber: string;
  abdmHfrId: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  officialHospitalEmail: string;
  hospitalContactNumber: string;
  registrantName: string;
  designation: string;
  employeeId: string;
  phoneNumber: string;
  email: string;
  licenseCertificateLink: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role?: string;
  username?: string;
  displayName?: string;
  isVerified?: boolean;
}

export interface CertificateResponse {
  link: string;
}

export interface ApiResponse {
  message: string;
}

export interface Hospital {
  id: number;
  hospitalName: string;
  licenseNumber: string;
  abdmHfrId: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  officialHospitalEmail: string;
  hospitalContactNumber: string;
  registrantName: string;
  designation: string;
  employeeId: string;
  phoneNumber: string;
  email: string;
  licenseCertificateLink: string;
  isVerified: boolean;
}
