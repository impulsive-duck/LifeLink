package com.bbms.blood_bank_management.donor.dto.donationrequest;

import com.bbms.blood_bank_management.donor.enums.DonationRequestStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequestActionResponse {

    private Long donationRequestId;

    private DonationRequestStatus status;

    private String message;
}