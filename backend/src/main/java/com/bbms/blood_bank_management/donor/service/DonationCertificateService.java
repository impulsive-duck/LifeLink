package com.bbms.blood_bank_management.donor.service;
import java.util.List;

import com.bbms.blood_bank_management.donor.dto.donation.DonationCertificateResponse;
import com.bbms.blood_bank_management.donor.dto.donation.DonationVerificationResponse;

public interface DonationCertificateService {

    DonationCertificateResponse uploadCertificate(
            String username,
            String certificateUrl,
            Long donationRequestId,
            String certificateNumber,
            String issuingOrganizationName,
            Long issuingOrganizationId,
            String donationDate
    );

    DonationCertificateResponse getCertificateFile(
            String username,
            Long certificateId
    );

    DonationVerificationResponse verifyCertificate(
            Long certificateId,
            Long issuingOrganizationId
    );

    DonationVerificationResponse rejectCertificate(
            Long certificateId,
            Long issuingOrganizationId
    );

    List<DonationCertificateResponse> getAllCertificates(
        String username
    );

    List<DonationCertificateResponse> getPendingCertificates(
        Long issuingOrganizationId
);
}