package com.bbms.blood_bank_management.donor.service;

import java.util.List;

import com.bbms.blood_bank_management.donor.dto.search.DonorSearchResponse;
import com.bbms.blood_bank_management.donor.enums.BloodGroup;
import com.bbms.blood_bank_management.donor.service.DonorSearchService;


public interface DonorSearchService {

    List<DonorSearchResponse> searchEligibleDonors(
        Long bloodBankId,
        BloodGroup bloodGroup
    );
}