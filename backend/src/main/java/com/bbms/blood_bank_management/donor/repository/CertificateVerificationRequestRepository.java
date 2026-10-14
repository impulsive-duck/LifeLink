package com.bbms.blood_bank_management.donor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bbms.blood_bank_management.donor.entity.CertificateVerificationRequest;
import com.bbms.blood_bank_management.donor.enums.VerificationRequestStatus;

public interface CertificateVerificationRequestRepository
        extends JpaRepository<CertificateVerificationRequest, Long> {

    List<CertificateVerificationRequest> findByDonorId(
            Long donorId);

    List<CertificateVerificationRequest> findByIssuingOrganizationId(
            Long issuingOrganizationId);

    List<CertificateVerificationRequest>
            findByIssuingOrganizationIdAndStatus(
                    Long issuingOrganizationId,
                    VerificationRequestStatus status);

    Optional<CertificateVerificationRequest>
            findByCertificate_CertificateId(
                    Long certificateId);

    boolean existsByCertificateCertificateIdAndStatus(
            Long certificateId,
            VerificationRequestStatus status);
}