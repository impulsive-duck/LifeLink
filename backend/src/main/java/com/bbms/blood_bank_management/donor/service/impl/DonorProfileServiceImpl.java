package com.bbms.blood_bank_management.donor.service.impl;

import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.donor.dto.profile.DonorProfileResponse;
import com.bbms.blood_bank_management.donor.dto.profile.DonorProfileUpdateRequest;
import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.service.DonorProfileService;

@Service
public class DonorProfileServiceImpl implements DonorProfileService {

    private final DonorRepository donorRepository;

    public DonorProfileServiceImpl(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @Override
    public DonorProfileResponse getProfile(String username) {

        Donor donor = donorRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        return mapToResponse(donor);
    }

    @Override
    public DonorProfileResponse updateProfile(
            String username,
            DonorProfileUpdateRequest request) {

        Donor donor = donorRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        boolean emailChanged = request.getEmail() != null
                && !request.getEmail().trim().isEmpty()
                && !request.getEmail().trim().equalsIgnoreCase(donor.getEmail());

        boolean mobileChanged = request.getMobileNumber() != null
                && !request.getMobileNumber().trim().isEmpty()
                && !request.getMobileNumber().trim().equals(donor.getMobileNumber());

        // Faculty Requirement 16: Prevent simultaneous modification of both primary contact methods
        if (emailChanged && mobileChanged) {
            throw new RuntimeException("Simultaneous update of both email and mobile number is restricted for account security. Please update them one at a time.");
        }

        // Check email format & uniqueness if changed
        if (emailChanged) {
            String email = request.getEmail().trim().toLowerCase();
            if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                throw new RuntimeException("Invalid email format");
            }
            if (donorRepository.existsByEmail(email)) {
                throw new RuntimeException("Email already exists");
            }
            donor.setEmail(email);
        }

        // Check mobile number format & uniqueness if changed
        if (mobileChanged) {
            String mobile = request.getMobileNumber().trim();
            if (!mobile.matches("^[6-9][0-9]{9}$")) {
                throw new RuntimeException("Mobile number must be a valid 10-digit Indian phone number starting with 6-9");
            }
            if (donorRepository.existsByMobileNumber(mobile)) {
                throw new RuntimeException("Mobile Number already exists");
            }
            donor.setMobileNumber(mobile);
        }

        // Update only provided fields
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            if (request.getFullName().matches(".*\\d.*")) {
                throw new RuntimeException("Full name must not contain digits");
            }
            donor.setFullName(request.getFullName().trim());
        }

        if (request.getAddress() != null) {
            donor.setAddress(request.getAddress());
        }

        if (request.getCity() != null) {
            donor.setCity(request.getCity());
        }

        if (request.getState() != null) {
            donor.setState(request.getState());
        }

        Donor updatedDonor = donorRepository.save(donor);

        return mapToResponse(updatedDonor);
    }

    private DonorProfileResponse mapToResponse(Donor donor) {

        return new DonorProfileResponse(
                donor.getDonorId(),
                donor.getBloodBankId(),
                donor.getUsername(),
                donor.getFullName(),
                donor.getEmail(),
                donor.getMobileNumber(),
                donor.getGender(),
                donor.getDateOfBirth(),
                donor.getBloodGroup(),
                donor.getWeight(),
                donor.getHemoglobin(),
                donor.getAddress(),
                donor.getCity(),
                donor.getState(),
                donor.getLastDonationDate(),
                donor.getAvailabilityStatus(),
                donor.getDonationCount(),
                donor.getCreatedDate()
        );
    }
}