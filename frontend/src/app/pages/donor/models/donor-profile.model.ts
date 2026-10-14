export interface DonorProfile {

  donorId: number;

  bloodBankId: number;

  username: string;

  fullName: string;

  email: string;

  mobileNumber: string;

  gender: 'MALE' | 'FEMALE' | 'OTHER';

  dateofBirth: string;

  bloodGroup:
    | 'A_POSITIVE'
    | 'A_NEGATIVE'
    | 'B_POSITIVE'
    | 'B_NEGATIVE'
    | 'AB_POSITIVE'
    | 'AB_NEGATIVE'
    | 'O_POSITIVE'
    | 'O_NEGATIVE';

  weight: number;

  hemoglobin: number;

  address: string;

  city: string;

  state: string;

  lastDonationDate: string;

  availabilityStatus:
    | 'AVAILABLE'
    | 'UNAVAILABLE';

  donationCount: number;

  createdDate: string;
}