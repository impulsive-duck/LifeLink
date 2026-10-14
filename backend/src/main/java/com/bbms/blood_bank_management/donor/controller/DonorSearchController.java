package com.bbms.blood_bank_management.donor.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bbms.blood_bank_management.donor.dto.search.DonorSearchResponse;
import com.bbms.blood_bank_management.donor.enums.BloodGroup;
import com.bbms.blood_bank_management.donor.service.DonorSearchService;

@RestController
@RequestMapping("/api/donor")
public class DonorSearchController {

    private final DonorSearchService donorSearchService;

    public DonorSearchController(
            DonorSearchService donorSearchService) {

        this.donorSearchService = donorSearchService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<DonorSearchResponse>> searchEligibleDonors(
        @RequestParam Long bloodBankId,
            @RequestParam BloodGroup bloodGroup) {

        List<DonorSearchResponse> donors =
                donorSearchService.searchEligibleDonors(
                    bloodBankId,
                        bloodGroup
                );

        return ResponseEntity.ok(donors);
    }
}