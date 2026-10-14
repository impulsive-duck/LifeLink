package com.bbms.blood_bank_management.donor.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbms.blood_bank_management.donor.dto.donationrequest.DonationRequestActionResponse;
import com.bbms.blood_bank_management.donor.dto.donationrequest.DonationRequestResponse;
import com.bbms.blood_bank_management.donor.service.DonationRequestService;

@RestController
@RequestMapping("/api/donor/donation-requests")
public class DonationRequestController {

    private final DonationRequestService donationRequestService;

    public DonationRequestController(
            DonationRequestService donationRequestService) {

        this.donationRequestService = donationRequestService;
    }

    @GetMapping
    public ResponseEntity<List<DonationRequestResponse>>
    getMyDonationRequests(Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                donationRequestService.getMyDonationRequests(username)
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DonationRequestResponse>>
    getMyPendingDonationRequests(Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                donationRequestService.getMyPendingDonationRequests(username)
        );
    }

    @GetMapping("/{donationRequestId}")
    public ResponseEntity<DonationRequestResponse>
    getMyDonationRequest(
            @PathVariable Long donationRequestId,
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                donationRequestService.getMyDonationRequest(
                        username,
                        donationRequestId
                )
        );
    }

    @PatchMapping("/{donationRequestId}/accept")
    public ResponseEntity<DonationRequestActionResponse>
    acceptDonationRequest(
            @PathVariable Long donationRequestId,
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                donationRequestService.acceptDonationRequest(
                        username,
                        donationRequestId
                )
        );
    }

    @PatchMapping("/{donationRequestId}/reject")
    public ResponseEntity<DonationRequestActionResponse>
    rejectDonationRequest(
            @PathVariable Long donationRequestId,
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                donationRequestService.rejectDonationRequest(
                        username,
                        donationRequestId
                )
        );
    }

    @GetMapping("/bloodbank")
    public ResponseEntity<List<DonationRequestResponse>>
    getBloodBankDonationRequests(Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;

        return ResponseEntity.ok(
                donationRequestService.getDonationRequestsForBloodBank(email)
        );
    }

    @GetMapping("/hospital")
    public ResponseEntity<List<DonationRequestResponse>>
    getHospitalDonationRequests(Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;

        return ResponseEntity.ok(
                donationRequestService.getDonationRequestsForHospital(email)
        );
    }
}