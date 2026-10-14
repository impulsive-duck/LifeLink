import { Hospital } from './hospital-auth.model';

export interface BloodInventory {
  id?: number;
  bloodGroup: string;
  units: number;
  hospital?: Hospital;
}

export interface UpdateInventoryRequest {
  bloodGroup: string;
  units: number;
}

export const HOSPITAL_BLOOD_GROUPS: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
