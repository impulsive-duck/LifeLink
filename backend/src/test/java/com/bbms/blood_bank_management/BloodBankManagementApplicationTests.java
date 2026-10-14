package com.bbms.blood_bank_management;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bbms.blood_bank_management.donor.dto.auth.DonorLoginRequest;
import com.bbms.blood_bank_management.donor.dto.auth.DonorLoginResponse;
import com.bbms.blood_bank_management.donor.dto.auth.DonorRegisterRequest;
import com.bbms.blood_bank_management.donor.dto.auth.DonorRegisterResponse;
import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.enums.BloodGroup;
import com.bbms.blood_bank_management.donor.enums.Gender;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.service.AuthService;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BloodBankManagementApplicationTests {

    @Autowired
    private AuthService donorAuthService;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
    }

    @Test
    void testDonorRegistrationAndLoginFlow() {
        String uniqueUser = "test_donor_" + System.currentTimeMillis();
        String uniqueEmail = uniqueUser + "@test.org";
        String uniqueMobile = "9" + (long)(Math.random() * 900000000L + 100000000L);
        String rawPassword = "TestPassword@123";

        DonorRegisterRequest request = new DonorRegisterRequest();
        request.setBloodBankId(1L);
        request.setUsername(uniqueUser);
        request.setPassword(rawPassword);
        request.setFullName("Test Donor Name");
        request.setEmail(uniqueEmail);
        request.setMobileNumber(uniqueMobile);
        request.setGender(Gender.MALE);
        request.setDateOfBirth(LocalDate.of(1995, 5, 20));
        request.setBloodGroup(BloodGroup.O_POSITIVE);
        request.setWeight(70.0);
        request.setHemoglobin(14.0);
        request.setAddress("123 Test Street");
        request.setCity("Mumbai");
        request.setState("Maharashtra");

        // 1. Register donor
        DonorRegisterResponse registerResponse = donorAuthService.register(request);
        assertNotNull(registerResponse);
        assertNotNull(registerResponse.getDonorId());
        assertEquals(uniqueUser, registerResponse.getUsername());

        // 2. Verify database persistence and encoded password
        Donor persisted = donorRepository.findByUsername(uniqueUser).orElse(null);
        assertNotNull(persisted, "Donor must be persisted in database");
        assertNotNull(persisted.getPassword(), "Donor password must NOT be null");
        assertNotEquals(rawPassword, persisted.getPassword(), "Password must NOT be stored in plain text");
        assertTrue(passwordEncoder.matches(rawPassword, persisted.getPassword()), "Encoded password must match original raw password");

        // 3. Verify Login flow
        DonorLoginRequest loginRequest = new DonorLoginRequest();
        loginRequest.setUsername(uniqueUser);
        loginRequest.setPassword(rawPassword);

        DonorLoginResponse loginResponse = donorAuthService.login(loginRequest);
        assertNotNull(loginResponse);
        assertNotNull(loginResponse.getToken());
        assertEquals("Login Successful", loginResponse.getMessage());
    }

}

