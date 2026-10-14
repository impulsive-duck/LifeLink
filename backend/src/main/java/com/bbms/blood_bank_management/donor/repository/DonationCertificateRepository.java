package com.bbms.blood_bank_management.donor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bbms.blood_bank_management.donor.entity.DonationCertificate;
import com.bbms.blood_bank_management.donor.enums.CertificateVerificationStatus;

public interface DonationCertificateRepository
        extends JpaRepository<DonationCertificate, Long> {

    List<DonationCertificate> findByDonationRequestDonationRequestId(
            Long donationRequestId);

    List<DonationCertificate> findByDonationRequestDonorId(
            Long donorId);

    Optional<DonationCertificate> findByCertificateNumber(
            String certificateNumber);

    boolean existsByCertificateNumber(
            String certificateNumber);

    List<DonationCertificate> findByVerificationStatus(
            CertificateVerificationStatus verificationStatus);

    Optional<DonationCertificate> findByCertificateIdAndIssuingOrganizationId(
            Long certificateId,
            Long issuingOrganizationId);
List<DonationCertificate>
findByIssuingOrganizationIdAndVerificationStatus(
        Long issuingOrganizationId,
        CertificateVerificationStatus verificationStatus);
List<DonationCertificate> findByDonationRequest_DonorId(Long donorId);
}