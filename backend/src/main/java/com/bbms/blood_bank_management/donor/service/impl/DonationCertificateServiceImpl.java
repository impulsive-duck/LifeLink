package com.bbms.blood_bank_management.donor.service.impl;
import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bbms.blood_bank_management.donor.dto.donation.DonationCertificateResponse;
import com.bbms.blood_bank_management.donor.dto.donation.DonationVerificationResponse;
import com.bbms.blood_bank_management.donor.entity.CertificateVerificationRequest;
import com.bbms.blood_bank_management.donor.entity.DonationCertificate;
import com.bbms.blood_bank_management.donor.entity.DonationRequest;
import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.enums.AvailabilityStatus;
import com.bbms.blood_bank_management.donor.enums.CertificateVerificationStatus;
import com.bbms.blood_bank_management.donor.enums.VerificationRequestStatus;
import com.bbms.blood_bank_management.donor.enums.DonationRequestStatus;
import com.bbms.blood_bank_management.donor.repository.CertificateVerificationRequestRepository;
import com.bbms.blood_bank_management.donor.repository.DonationCertificateRepository;
import com.bbms.blood_bank_management.donor.repository.DonationRequestRepository;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.service.DonationCertificateService;

@Service
public class DonationCertificateServiceImpl
        implements DonationCertificateService {

    private final DonationCertificateRepository certificateRepository;
    private final DonationRequestRepository donationRequestRepository;
    private final DonorRepository donorRepository;
    private final CertificateVerificationRequestRepository verificationRequestRepository;

    public DonationCertificateServiceImpl(
            DonationCertificateRepository certificateRepository,
            DonationRequestRepository donationRequestRepository,
            DonorRepository donorRepository,
            CertificateVerificationRequestRepository verificationRequestRepository) {

        this.certificateRepository = certificateRepository;
        this.donationRequestRepository = donationRequestRepository;
        this.donorRepository = donorRepository;
        this.verificationRequestRepository = verificationRequestRepository;
    }

    @Override
    public DonationCertificateResponse uploadCertificate(
            String username,
            String certificateUrl,
            Long donationRequestId,
            String certificateNumber,
            String issuingOrganizationName,
            Long issuingOrganizationId,
            String donationDate) {

        Donor donor = donorRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Donor not found"));

        DonationRequest donationRequest =
                donationRequestRepository
                        .findById(donationRequestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Donation request not found"));

        if (!donationRequest.getDonorId()
                .equals(donor.getDonorId())) {

            throw new RuntimeException(
                    "You are not authorized to upload a certificate for this request");
        }

        if (certificateRepository
                .existsByCertificateNumber(certificateNumber)) {

            throw new RuntimeException(
                    "Certificate number already exists");
        }

        if (certificateUrl == null
                || certificateUrl.isBlank()) {

            throw new RuntimeException(
                    "Certificate URL is required");
        }

        DonationCertificate certificate =
                new DonationCertificate();

        certificate.setCertificateUrl(certificateUrl);
        certificate.setDonationRequest(donationRequest);
        certificate.setCertificateNumber(certificateNumber);
        certificate.setDonationDate(
                LocalDate.parse(donationDate));
        certificate.setIssuingOrganizationName(
                issuingOrganizationName);
        certificate.setIssuingOrganizationId(
        issuingOrganizationId);
        certificate.setVerificationStatus(
                CertificateVerificationStatus.PENDING_VERIFICATION);

        DonationCertificate savedCertificate =
                certificateRepository.save(certificate);


                CertificateVerificationRequest verificationRequest =
        new CertificateVerificationRequest();

verificationRequest.setCertificate(
        savedCertificate);

verificationRequest.setDonorId(
        donor.getDonorId());

verificationRequest.setIssuingOrganizationId(
        savedCertificate.getIssuingOrganizationId());

verificationRequest.setIssuingOrganizationName(
        savedCertificate.getIssuingOrganizationName());

verificationRequest.setStatus(
        VerificationRequestStatus.PENDING);

verificationRequest.setRequestedDate(
        LocalDateTime.now());

verificationRequestRepository.save(
        verificationRequest);

        return new DonationCertificateResponse(
                savedCertificate.getCertificateId(),
                savedCertificate.getCertificateUrl(),
                donationRequest.getDonationRequestId(),
                savedCertificate.getCertificateNumber(),
                savedCertificate.getDonationDate(),
                savedCertificate.getIssuingOrganizationName(),
                savedCertificate.getIssuingOrganizationId(),
                savedCertificate.getVerificationStatus(),
                savedCertificate.getUploadedDate(),
                savedCertificate.getVerifiedDate(),
                "Certificate uploaded successfully and is pending verification");
    }

    @Override
public DonationCertificateResponse getCertificateFile(
        String username,
        Long certificateId) {

    Donor donor = donorRepository
            .findByUsername(username)
            .orElseThrow(() ->
                    new RuntimeException("Donor not found"));

    DonationCertificate certificate =
            certificateRepository.findById(certificateId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Certificate not found"));

    if (!certificate.getDonationRequest()
            .getDonorId()
            .equals(donor.getDonorId())) {

        throw new RuntimeException(
                "Unauthorized access");
    }

    return new DonationCertificateResponse(
        certificate.getCertificateId(),
        certificate.getCertificateUrl(),
        certificate.getDonationRequest().getDonationRequestId(),
        certificate.getCertificateNumber(),
        certificate.getDonationDate(),
        certificate.getIssuingOrganizationName(),
        certificate.getIssuingOrganizationId(),
        certificate.getVerificationStatus(),
        certificate.getUploadedDate(),
        certificate.getVerifiedDate(),
        "Certificate fetched successfully");
}

@Override
public List<DonationCertificateResponse> getAllCertificates(
        String username) {

    Donor donor = donorRepository
            .findByUsername(username)
            .orElseThrow(() ->
                    new RuntimeException("Donor not found"));

    List<DonationCertificate> certificates =
            certificateRepository.findByDonationRequest_DonorId(
                    donor.getDonorId());

    return certificates.stream()
            .map(certificate -> new DonationCertificateResponse(
                    certificate.getCertificateId(),
                    certificate.getCertificateUrl(),
                    certificate.getDonationRequest().getDonationRequestId(),
                    certificate.getCertificateNumber(),
                    certificate.getDonationDate(),
                    certificate.getIssuingOrganizationName(),
                    certificate.getIssuingOrganizationId(),
                    certificate.getVerificationStatus(),
                    certificate.getUploadedDate(),
                    certificate.getVerifiedDate(),
                    "Certificate fetched successfully"))
            .toList();
}

@Override
public List<DonationCertificateResponse> getPendingCertificates(
        Long issuingOrganizationId) {

    List<DonationCertificate> certificates =
            certificateRepository
                    .findByIssuingOrganizationIdAndVerificationStatus(
                            issuingOrganizationId,
                            CertificateVerificationStatus.PENDING_VERIFICATION);

    return certificates.stream()
            .map(certificate -> new DonationCertificateResponse(
                    certificate.getCertificateId(),
                    certificate.getCertificateUrl(),
                    certificate.getDonationRequest().getDonationRequestId(),
                    certificate.getCertificateNumber(),
                    certificate.getDonationDate(),
                    certificate.getIssuingOrganizationName(),
                    certificate.getIssuingOrganizationId(),
                    certificate.getVerificationStatus(),
                    certificate.getUploadedDate(),
                    certificate.getVerifiedDate(),
                    "Pending verification"))
            .toList();
}

    @Override
    @Transactional
    public DonationVerificationResponse verifyCertificate(
            Long certificateId,
            Long issuingOrganizationId) {

        DonationCertificate certificate =
                certificateRepository.findById(certificateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Donation certificate not found"));

        if (!certificate.getIssuingOrganizationId()
        .equals(issuingOrganizationId)) {

    throw new RuntimeException(
            "You are not authorized to verify this certificate");
}

        if (certificate.getVerificationStatus()
                == CertificateVerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Certificate has already been verified");
        }

        DonationRequest donationRequest =
                certificate.getDonationRequest();

        if (donationRequest == null) {

            throw new RuntimeException(
                    "Donation request not found for this certificate");
        }
        donationRequest.setStatus(
        DonationRequestStatus.COMPLETED);

donationRequest.setResponseDate(
        LocalDateTime.now());

donationRequestRepository.save(
        donationRequest);

        Donor donor =
                donorRepository.findById(
                                donationRequest.getDonorId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Donor not found"));

        donor.setLastDonationDate(
                certificate.getDonationDate());

        donor.setDonationCount(
                donor.getDonationCount() + 1);

        donor.setAvailabilityStatus(
                AvailabilityStatus.UNAVAILABLE);

        donorRepository.save(donor);

        certificate.setVerificationStatus(
                CertificateVerificationStatus.VERIFIED);

        certificate.setVerifiedDate(
                LocalDateTime.now());

        certificateRepository.save(certificate);

        CertificateVerificationRequest verificationRequest =
                verificationRequestRepository
                        .findByCertificate_CertificateId(
                                certificateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Verification request not found"));

        verificationRequest.setStatus(
                VerificationRequestStatus.VERIFIED);

        verificationRequest.setRespondedDate(
                LocalDateTime.now());

        verificationRequestRepository.save(
                verificationRequest);

        return new DonationVerificationResponse(
                certificate.getCertificateId(),
                donor.getDonorId(),
                donor.getLastDonationDate(),
                donor.getDonationCount(),
                donor.getAvailabilityStatus(),
                "Certificate verified and donor donation information updated successfully");
    }

    @Override
    @Transactional
    public DonationVerificationResponse rejectCertificate(
            Long certificateId,
            Long issuingOrganizationId) {

        DonationCertificate certificate =
                certificateRepository.findById(certificateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Donation certificate not found"));

        if (!certificate.getIssuingOrganizationId().equals(issuingOrganizationId)) {
            throw new RuntimeException(
                    "You are not authorized to reject this certificate");
        }

        if (certificate.getVerificationStatus() == CertificateVerificationStatus.VERIFIED) {
            throw new RuntimeException(
                    "Certificate has already been verified and cannot be rejected");
        }

        certificate.setVerificationStatus(
                CertificateVerificationStatus.REJECTED);
        certificate.setVerifiedDate(
                LocalDateTime.now());
        certificateRepository.save(certificate);

        verificationRequestRepository
                .findByCertificate_CertificateId(certificateId)
                .ifPresent(req -> {
                    req.setStatus(VerificationRequestStatus.REJECTED);
                    req.setRespondedDate(LocalDateTime.now());
                    verificationRequestRepository.save(req);
                });

        DonationRequest donationRequest = certificate.getDonationRequest();
        if (donationRequest != null) {
            donationRequest.setStatus(DonationRequestStatus.REJECTED);
            donationRequest.setResponseDate(LocalDateTime.now());
            donationRequestRepository.save(donationRequest);
        }
        Long donorId = (donationRequest != null) ? donationRequest.getDonorId() : null;
        Donor donor = (donorId != null) ? donorRepository.findById(donorId).orElse(null) : null;

        return new DonationVerificationResponse(
                certificate.getCertificateId(),
                (donor != null) ? donor.getDonorId() : 0L,
                (donor != null) ? donor.getLastDonationDate() : null,
                (donor != null) ? donor.getDonationCount() : 0,
                (donor != null) ? donor.getAvailabilityStatus() : null,
                "Certificate verification was rejected successfully");
    }
}