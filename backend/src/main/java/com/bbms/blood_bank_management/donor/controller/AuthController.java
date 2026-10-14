package com.bbms.blood_bank_management.donor.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation .*;

import com.bbms.blood_bank_management.donor.dto.auth. DonorLoginRequest;
import com.bbms.blood_bank_management.donor.dto.auth.DonorLoginResponse;
import com.bbms.blood_bank_management.donor.dto.auth. DonorRegisterRequest;
import com.bbms.blood_bank_management.donor.dto.auth. DonorRegisterResponse;
import com.bbms.blood_bank_management.donor.service.AuthService;

@RestController("donorAuthController")
@RequestMapping("/api/donor")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<DonorLoginResponse> login(@RequestBody DonorLoginRequest request) {

        DonorLoginResponse response = authService. login(request);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<DonorRegisterResponse> register(
        @jakarta.validation.Valid @RequestBody DonorRegisterRequest request) {

        DonorRegisterResponse response = authService.register(request);

        return new ResponseEntity<>(response, HttpStatus. CREATED);
    }
}