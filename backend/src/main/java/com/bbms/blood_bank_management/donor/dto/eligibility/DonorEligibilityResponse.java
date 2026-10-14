package com.bbms.blood_bank_management.donor.dto.eligibility;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonorEligibilityResponse {

    private boolean eligible;

    private String reason;
}