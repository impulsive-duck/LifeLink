export interface BloodBankSearchResult {
  bloodBankId: number;
  bloodBankName: string;
  availableUnits: number;
  distanceKm: number;
  address?: string;
  city?: string;
  state?: string;
  contactNumber?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
}
