export interface DonationRequest {

  donationRequestId: number;

  donorId: number;

  bloodBankId: number;

  hospitalId: number;

  bloodRequestId: number;

  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'COMPLETED';

  requestDate: string;

  responseDate: string;

}