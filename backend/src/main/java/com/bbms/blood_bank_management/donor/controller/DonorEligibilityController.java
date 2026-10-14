package com.bbms.blood_bank_management.donor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbms.blood_bank_management.donor.dto.eligibility.DonorEligibilityResponse;
import com.bbms.blood_bank_management.donor.service.DonorEligibilityService;

@RestController
@RequestMapping("/api/donor/eligibility")
public class DonorEligibilityController {

    private final DonorEligibilityService donorEligibilityService;

    public DonorEligibilityController(
            DonorEligibilityService donorEligibilityService) {
        this.donorEligibilityService = donorEligibilityService;
    }

    @GetMapping
    public ResponseEntity<DonorEligibilityResponse> checkEligibility(
            Authentication authentication) {

        String username = authentication.getName();

        DonorEligibilityResponse response =
                donorEligibilityService.checkEligibility(username);

        return ResponseEntity.ok(response);
    }
}