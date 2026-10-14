package com.bbms.blood_bank_management.donor.controller;

import java.net.URI;
import java.security.Principal;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bbms.blood_bank_management.donor.dto.donation.DonationCertificateResponse;
import com.bbms.blood_bank_management.donor.service.DonationCertificateService;

@RestController
@RequestMapping("/api/donor")
public class DonationCertificateController {

    private final DonationCertificateService certificateService;

    public DonationCertificateController(
            DonationCertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping("/donation-requests/{requestId}/certificate")
    public ResponseEntity<DonationCertificateResponse> uploadCertificate(
            @RequestParam String certificateUrl,
            @PathVariable Long requestId,
            @RequestParam String certificateNumber,
            @RequestParam String issuingOrganizationName,
            @RequestParam Long issuingOrganizationId,
            @RequestParam String donationDate,
            Principal principal) {

        String username = principal.getName();

        DonationCertificateResponse response =
                certificateService.uploadCertificate(
                        username,
                        certificateUrl,
                        requestId,
                        certificateNumber,
                        issuingOrganizationName,
                        issuingOrganizationId,
                        donationDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/certificates/{certificateId}/file")
    public ResponseEntity<DonationCertificateResponse> getCertificateFile(
            @PathVariable Long certificateId,
            Principal principal) {

        DonationCertificateResponse response =
                certificateService.getCertificateFile(
                        principal.getName(),
                        certificateId);

                System.out.println("URL = " + response.getCertificateUrl());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/certificates")
public ResponseEntity<List<DonationCertificateResponse>> getAllCertificates(
        Principal principal) {

    List<DonationCertificateResponse> certificates =
            certificateService.getAllCertificates(
                    principal.getName());

    return ResponseEntity.ok(certificates);
}
}