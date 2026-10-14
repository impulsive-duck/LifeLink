import { Hospital } from './hospital-auth.model';

export interface BloodBankSummary {
  id?: number;
  bloodBankName?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface BloodRequestDto {
  bloodGroup: string;
  dateOfRequirement: string;
  numberOfUnits: number;
  bloodBankId?: number;
}

export interface BloodRequest {
  id: number;
  bloodGroup: string;
  dateOfRequirement: string;
  numberOfUnits: number;
  latitude: number;
  longitude: number;
  read: boolean;
  status?: string;
  hospital?: Hospital;
  bloodBank?: BloodBankSummary;
}
