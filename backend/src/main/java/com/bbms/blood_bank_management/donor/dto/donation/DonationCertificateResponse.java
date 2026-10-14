package com.bbms.blood_bank_management.donor.dto.donation;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bbms.blood_bank_management.donor.enums.CertificateVerificationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationCertificateResponse {

    private Long certificateId;

    private String certificateUrl;

    private Long donationRequestId;

    private String certificateNumber;

    private LocalDate donationDate;

    private String issuingOrganizationName;

    private Long issuingOrganizationId;

    private CertificateVerificationStatus verificationStatus;

    private LocalDateTime uploadedDate;

    private LocalDateTime verifiedDate;

    private String message;
}