export interface DonationRequestActionResponse {

  donationRequestId: number;

  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'COMPLETED';

  message: string;

}