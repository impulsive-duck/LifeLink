package com.bbms.blood_bank_management.donor.service;

import com.bbms.blood_bank_management.donor.dto.donation.CertificateVerificationRequestResponse;

public interface CertificateVerificationRequestService {

CertificateVerificationRequestResponse requestVerification(
String username,
Long certificateId);

}