package com.bbms.blood_bank_management.donor.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.donor.dto.donation.CertificateVerificationRequestResponse;
import com.bbms.blood_bank_management.donor.entity.CertificateVerificationRequest;
import com.bbms.blood_bank_management.donor.entity.DonationCertificate;
import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.enums.CertificateVerificationStatus;
import com.bbms.blood_bank_management.donor.enums.VerificationRequestStatus;
import com.bbms.blood_bank_management.donor.repository.CertificateVerificationRequestRepository;
import com.bbms.blood_bank_management.donor.repository.DonationCertificateRepository;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.service.CertificateVerificationRequestService;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CertificateVerificationRequestServiceImpl
        implements CertificateVerificationRequestService {

    private final CertificateVerificationRequestRepository requestRepository;
    private final DonationCertificateRepository certificateRepository;
    private final DonorRepository donorRepository;

    public CertificateVerificationRequestServiceImpl(
            CertificateVerificationRequestRepository requestRepository,
            DonationCertificateRepository certificateRepository,
            DonorRepository donorRepository) {

        this.requestRepository = requestRepository;
        this.certificateRepository = certificateRepository;
        this.donorRepository = donorRepository;
    }

    @Override
    @Transactional
    public CertificateVerificationRequestResponse requestVerification(
            String username,
            Long certificateId) {

        // 1. Get logged-in donor
        Donor donor = donorRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Donor not found"));

        // 2. Find certificate
        DonationCertificate certificate = certificateRepository
                .findById(certificateId)
                .orElseThrow(() ->
                        new RuntimeException("Certificate not found"));

        // 3. Get donation request associated with certificate
        Long certificateDonorId = certificate
                .getDonationRequest()
                .getDonorId();

        // 4. Make sure certificate belongs to logged-in donor
        if (!certificateDonorId.equals(donor.getDonorId())) {
            throw new RuntimeException(
                    "You are not authorized to request verification for this certificate");
        }

        // 5. Certificate must be in UPLOADED state
        if (certificate.getVerificationStatus()
                != CertificateVerificationStatus.UPLOADED) {

            throw new RuntimeException(
                    "Verification request cannot be sent for the current certificate status");
        }

        // 6. Prevent duplicate pending request
        if (requestRepository
                .existsByCertificateCertificateIdAndStatus(
                        certificateId,
                        VerificationRequestStatus.PENDING)) {

            throw new RuntimeException(
                    "Verification request is already pending");
        }

        // 7. Create verification request
        CertificateVerificationRequest request =
                new CertificateVerificationRequest();

        request.setCertificate(certificate);

        request.setDonorId(
                donor.getDonorId());

        request.setIssuingOrganizationId(
                certificate.getIssuingOrganizationId());

        request.setIssuingOrganizationName(
                certificate.getIssuingOrganizationName());

        request.setStatus(
                VerificationRequestStatus.PENDING);

        request.setRequestedDate(
                LocalDateTime.now());

        // 8. Update certificate status
        certificate.setVerificationStatus(
                CertificateVerificationStatus.PENDING_VERIFICATION);

        certificateRepository.save(certificate);

        // 9. Save verification request
        CertificateVerificationRequest savedRequest =
                requestRepository.save(request);

        // 10. Return response
        return new CertificateVerificationRequestResponse(
                savedRequest.getRequestId(),
                certificate.getCertificateId(),
                certificate.getCertificateNumber(),
                savedRequest.getIssuingOrganizationId(),
                savedRequest.getIssuingOrganizationName(),
                savedRequest.getStatus(),
                savedRequest.getRequestedDate(),
                "Verification request sent successfully"
        );
    }
}