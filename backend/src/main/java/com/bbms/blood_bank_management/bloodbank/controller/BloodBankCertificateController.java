package com.bbms.blood_bank_management.bloodbank.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbms.blood_bank_management.bloodbank.repository.BloodBankRepository;
import com.bbms.blood_bank_management.donor.dto.donation.DonationCertificateResponse;
import com.bbms.blood_bank_management.donor.service.DonationCertificateService;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bbms.blood_bank_management.donor.dto.donation.DonationVerificationResponse;

@RestController
@RequestMapping("/api/bloodbank/certificates")
public class BloodBankCertificateController {

    private final DonationCertificateService certificateService;
    private final BloodBankRepository bloodBankRepository;

    public BloodBankCertificateController(
            DonationCertificateService certificateService,
            BloodBankRepository bloodBankRepository) {

        this.certificateService = certificateService;
        this.bloodBankRepository = bloodBankRepository;
    }

    @GetMapping("/pending")
public ResponseEntity<List<DonationCertificateResponse>>
getPendingCertificates(
        Authentication authentication) {

    Long bloodBankId =
            bloodBankRepository
                    .findByEmail(authentication.getName())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Blood Bank Not Found"))
                    .getId();

    List<DonationCertificateResponse> response =
            certificateService.getPendingCertificates(
                    bloodBankId);

    return ResponseEntity.ok(response);
}

@PutMapping("/{certificateId}/verify")
public ResponseEntity<DonationVerificationResponse>
verifyCertificate(
        @PathVariable Long certificateId,
        Authentication authentication) {

    Long bloodBankId =
            bloodBankRepository
                    .findByEmail(authentication.getName())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Blood Bank Not Found"))
                    .getId();

    DonationVerificationResponse response =
            certificateService.verifyCertificate(
                    certificateId,
                    bloodBankId);

    return ResponseEntity.ok(response);
}

@PutMapping("/{certificateId}/reject")
public ResponseEntity<DonationVerificationResponse>
rejectCertificate(
        @PathVariable Long certificateId,
        Authentication authentication) {

    Long bloodBankId =
            bloodBankRepository
                    .findByEmail(authentication.getName())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Blood Bank Not Found"))
                    .getId();

    DonationVerificationResponse response =
            certificateService.rejectCertificate(
                    certificateId,
                    bloodBankId);

    return ResponseEntity.ok(response);
}
}