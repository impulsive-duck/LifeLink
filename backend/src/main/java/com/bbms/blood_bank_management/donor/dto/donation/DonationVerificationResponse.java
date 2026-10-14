package com.bbms.blood_bank_management.donor.dto.donation;

import java.time.LocalDate;

import com.bbms.blood_bank_management.donor.enums.AvailabilityStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DonationVerificationResponse {

    private Long certificateId;

    private Long donorId;

    private LocalDate lastDonationDate;

    private int donationCount;

    private AvailabilityStatus availabilityStatus;

    private String message;
}