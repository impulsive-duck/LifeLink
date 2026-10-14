package com.bbms.blood_bank_management.donor.service.impl;

import org.springframework.stereotype. Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bbms.blood_bank_management.donor.dto.auth. DonorLoginRequest;
import com.bbms.blood_bank_management.donor.dto.auth. DonorLoginResponse;
import com.bbms.blood_bank_management.donor.dto.auth. DonorRegisterRequest;
import com.bbms.blood_bank_management.donor.dto.auth. DonorRegisterResponse;
import com.bbms.blood_bank_management.donor.service.AuthService;

import com.bbms.blood_bank_management.donor.entity. Donor;
import com.bbms.blood_bank_management.donor.enums.AvailabilityStatus;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {

    private final DonorRepository donorRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(DonorRepository donorRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.donorRepository = donorRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public DonorLoginResponse login(DonorLoginRequest request) {

        String u = request.getUsername() != null ? request.getUsername().trim() : "";
        Donor donor = donorRepository.findByUsernameIgnoreCase(u)
                .or(() -> donorRepository.findByEmailIgnoreCase(u))
                .orElseThrow(() -> new RuntimeException("Invalid Username or Password"));

        if (!passwordEncoder. matches(
            request.getPassword(),
            donor.getPassword())) {
            throw new RuntimeException("Invalid Username or Password");
        }

        String token = jwtUtil.generateToken(donor.getUsername());

        // Prepare Response
        DonorLoginResponse response = new DonorLoginResponse();
        
        response.setToken(token);
        response.setUsername(donor.getUsername());
        response.setFullName(donor.getFullName());
        response.setMessage("Login Successful");

        return response;

    }

    @Override
    public DonorRegisterResponse register(DonorRegisterRequest request) {

        // Check whether username already exists

        if (donorRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check whether email already exists
        if (donorRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check whether mobile number already exists
        if (donorRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new RuntimeException("Mobile number already exists");
        }

        // Create Donor entity
        Donor donor = new Donor();

        donor.setBloodBankId(request.getBloodBankId());
        donor.setUsername(request.getUsername());

        // Validate name does not contain digits
        if (request.getFullName() != null && request.getFullName().matches(".*\\d.*")) {
            throw new RuntimeException("Donor name must not contain digits");
        }

        // Validate password is provided
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required. Please enter your password and try again.");
        }

        // Encode password before storing it
        donor.setPassword(passwordEncoder.encode(request.getPassword()));

        donor.setFullName(request.getFullName());
        donor.setEmail(request.getEmail());
        donor.setMobileNumber(request.getMobileNumber());

        donor.setGender(request.getGender());
        donor.setDateOfBirth(request.getDateOfBirth());
        donor.setBloodGroup(request.getBloodGroup());
        donor.setWeight(request.getWeight());
        donor.setHemoglobin(request.getHemoglobin());
        donor.setAddress(request.getAddress());
        donor.setCity(request.getCity());
        donor.setState(request.getState());
        
        // Default values for a newly registered donor
        donor.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        donor.setDonationCount(0);

        // Save donor
        Donor savedDonor = donorRepository.save(donor);

        // Return response
        return new DonorRegisterResponse(
            savedDonor.getDonorId(),
            savedDonor.getUsername(),
            "Registration Successful"
        );
    }
}

