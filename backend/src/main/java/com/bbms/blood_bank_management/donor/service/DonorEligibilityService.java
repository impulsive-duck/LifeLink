package com.bbms.blood_bank_management.donor.service;

import com.bbms.blood_bank_management.donor.dto.eligibility.DonorEligibilityResponse;
import com.bbms.blood_bank_management.donor.entity.Donor;

public interface DonorEligibilityService {

    DonorEligibilityResponse checkEligibility(String username);
    DonorEligibilityResponse checkEligibility(Donor donor);

}