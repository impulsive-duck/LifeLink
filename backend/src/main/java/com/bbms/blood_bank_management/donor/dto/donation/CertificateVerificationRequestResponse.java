package com.bbms.blood_bank_management.donor.dto.donation;

import java.time.LocalDateTime;

import com.bbms.blood_bank_management.donor.enums.VerificationRequestStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateVerificationRequestResponse {

    private Long requestId;

    private Long certificateId;

    private String certificateNumber;

    private Long issuingOrganizationId;

    private String issuingOrganizationName;

    private VerificationRequestStatus status;

    private LocalDateTime requestedDate;

    private String message;
}