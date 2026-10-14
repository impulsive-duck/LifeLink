export interface DonationCertificate {
  certificateId: number;
  donationRequestId: number;

  certificateNumber: string;

  donationDate: string;

  issuingOrganizationName: string;
  issuingOrganizationId: number;

  bloodComponent: string;

  units: number;

  fileName: string;
  fileType: string;

  verificationStatus:
    | 'UPLOADED'
    | 'PENDING_VERIFICATION'
    | 'VERIFIED'
    | 'REJECTED';
}