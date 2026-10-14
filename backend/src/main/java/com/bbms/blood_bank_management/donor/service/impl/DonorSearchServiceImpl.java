package com.bbms.blood_bank_management.donor.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.donor.dto.search.DonorSearchResponse;
import com.bbms.blood_bank_management.donor.dto.eligibility.DonorEligibilityResponse;
import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.enums.AvailabilityStatus;
import com.bbms.blood_bank_management.donor.enums.BloodGroup;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.service.DonorEligibilityService;
import com.bbms.blood_bank_management.donor.service.DonorSearchService;

@Service
public class DonorSearchServiceImpl implements DonorSearchService {

    private final DonorRepository donorRepository;
    private final DonorEligibilityService donorEligibilityService;
    public DonorSearchServiceImpl(
            DonorRepository donorRepository,
            DonorEligibilityService donorEligibilityService) {

        this.donorRepository = donorRepository;
        this.donorEligibilityService = donorEligibilityService;
    }

    @Override
    public List<DonorSearchResponse> searchEligibleDonors(
        Long bloodBankId,
            BloodGroup bloodGroup) {

        List<Donor> donors =
                donorRepository.findByBloodGroupAndAvailabilityStatus(
                        bloodGroup,
                        AvailabilityStatus.AVAILABLE
                );

        List<DonorSearchResponse> eligibleDonors = new ArrayList<>();

        for (Donor donor : donors) {

            DonorEligibilityResponse eligibilityResponse =
                    donorEligibilityService.checkEligibility(donor);

            if (eligibilityResponse.isEligible()) {

                DonorSearchResponse response =
                        new DonorSearchResponse();

                response.setDonorId(donor.getDonorId());
                response.setFullName(donor.getFullName());
                response.setBloodGroup(donor.getBloodGroup());
                response.setGender(donor.getGender());
                response.setCity(donor.getCity());
                response.setState(donor.getState());
                response.setAvailabilityStatus(
                        donor.getAvailabilityStatus());

                response.setEligible(true);

                eligibleDonors.add(response);
            }
        }

        return eligibleDonors;
    }
}