package com.bbms.blood_bank_management.donor.service.impl;

import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.donor.dto.eligibility.DonorEligibilityResponse;
import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.service.DonorEligibilityService;

@Service
public class DonorEligibilityServiceImpl implements DonorEligibilityService {

    private static final int MINIMUM_AGE = 18;
    private static final int MAXIMUM_AGE = 65;
    private static final double MINIMUM_WEIGHT = 50.0;
    private static final double MINIMUM_HEMOGLOBIN = 12.5;
    private static final long MINIMUM_DONATION_INTERVAL_DAYS = 90;

    private final DonorRepository donorRepository;

    public DonorEligibilityServiceImpl(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @Override
    public DonorEligibilityResponse checkEligibility(String username) {

        Donor donor = donorRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        return checkEligibility(donor);
    }

    @Override
    public DonorEligibilityResponse checkEligibility(Donor donor) {

        // 1. Availability Check
        if (donor.getAvailabilityStatus() == null) {
            return new DonorEligibilityResponse(
                    false,
                    "Donor availability status is not available");
        }

        if (!donor.getAvailabilityStatus().name().equals("AVAILABLE")) {
            return new DonorEligibilityResponse(
                    false,
                    "Donor is currently unavailable");
        }

        // 2. Age Check
        int age = Period.between(
                donor.getDateOfBirth(),
                LocalDate.now())
                .getYears();

        if (age < MINIMUM_AGE || age > MAXIMUM_AGE) {
            return new DonorEligibilityResponse(
                    false,
                    "Donor age is outside the eligible age range");
        }

        // 3. Weight Check
        if (donor.getWeight() == null) {
            return new DonorEligibilityResponse(
                    false,
                    "Donor weight is not available");
        }

        if (donor.getWeight() < MINIMUM_WEIGHT) {
            return new DonorEligibilityResponse(
                    false,
                    "Donor weight is below the minimum required weight");
        }

        // 4. Hemoglobin Check
        if (donor.getHemoglobin() == null) {
            return new DonorEligibilityResponse(
                    false,
                    "Donor hemoglobin level is not available");
        }

        if (donor.getHemoglobin() < MINIMUM_HEMOGLOBIN) {
            return new DonorEligibilityResponse(
                    false,
                    "Donor hemoglobin level is below the minimum required level");
        }

        // 5. Last Donation Check
        if (donor.getLastDonationDate() != null) {

            long daysSinceLastDonation = ChronoUnit.DAYS.between(
                    donor.getLastDonationDate(),
                    LocalDate.now());

            if (daysSinceLastDonation < MINIMUM_DONATION_INTERVAL_DAYS) {
                return new DonorEligibilityResponse(
                        false,
                        "Minimum donation interval of 90 days has not been completed");
            }
        }

        // 6. All checks passed
        return new DonorEligibilityResponse(
                true,
                "Donor is eligible for donation"
        );
    }
}