package com.bbms.blood_bank_management.donor.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bbms.blood_bank_management.donor.dto.donation.CertificateVerificationRequestResponse;
import com.bbms.blood_bank_management.donor.service.CertificateVerificationRequestService;

@RestController
@RequestMapping("/api/donor")
public class CertificateVerificationRequestController {

    private final CertificateVerificationRequestService requestService;

    public CertificateVerificationRequestController(
            CertificateVerificationRequestService requestService) {

        this.requestService = requestService;
    }

    @PostMapping("/certificates/{certificateId}/request-verification")
    public ResponseEntity<CertificateVerificationRequestResponse>
            requestVerification(
                    @PathVariable Long certificateId,
                    Principal principal) {

        String username = principal.getName();

        CertificateVerificationRequestResponse response =
                requestService.requestVerification(
                        username,
                        certificateId);

        return ResponseEntity.ok(response);
    }
}