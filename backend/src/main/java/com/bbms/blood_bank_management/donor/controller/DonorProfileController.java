package com.bbms.blood_bank_management.donor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbms.blood_bank_management.donor.dto.profile.DonorProfileResponse;
import com.bbms.blood_bank_management.donor.dto.profile.DonorProfileUpdateRequest;
import com.bbms.blood_bank_management.donor.service.DonorProfileService;

@RestController
@RequestMapping("/api/donor/profile")
public class DonorProfileController {

    private final DonorProfileService donorProfileService;

    public DonorProfileController(DonorProfileService donorProfileService) {
        this.donorProfileService = donorProfileService;
    }

    @GetMapping
public ResponseEntity<DonorProfileResponse> getProfile(
        Authentication authentication) {

    System.out.println("DONOR AUTH OBJECT = " + authentication);

    String username = authentication.getName();

    DonorProfileResponse response =
            donorProfileService.getProfile(username);

    return ResponseEntity.ok(response);
}

    @PatchMapping
public ResponseEntity<DonorProfileResponse> updateProfile(
        Authentication authentication,
        @RequestBody DonorProfileUpdateRequest request) {

    System.out.println("DONOR AUTH OBJECT = " + authentication);

    String username = authentication.getName();

    DonorProfileResponse response =
            donorProfileService.updateProfile(username, request);

    return ResponseEntity.ok(response);
}
}