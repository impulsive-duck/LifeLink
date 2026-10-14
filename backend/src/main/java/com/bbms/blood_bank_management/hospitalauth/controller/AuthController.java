
package com.bbms.blood_bank_management.hospitalauth.controller;

import java.util.List;
import com.bbms.blood_bank_management.hospitalauth.entity.Hospital;
import com.bbms.blood_bank_management.hospitalauth.dto.*;
import com.bbms.blood_bank_management.hospitalauth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/signup")
    public AuthResponse signup(
            @RequestBody SignupRequest request){
                System.out.println("SIGNUP API HIT");
        return new AuthResponse(
                service.signup(request));
    }

    @PutMapping("/verify/{hospitalId}")
    public String verifyHospital(
        @PathVariable Long hospitalId) {

        return service.verifyHospital(hospitalId);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request){

        return new AuthResponse(
                service.login(request));
    }

    @GetMapping("/pending-hospitals")
    public List<Hospital> getPendingHospitals() {

        return service.getPendingHospitals();
    }

    // @GetMapping("/get-certificate/{hospitalId}")
    // public String getCertificate(
    //     @PathVariable Long hospitalId) {

    //     return service.getCertificateLink(hospitalId);
    // }

    @GetMapping("/get-certificate/{hospitalId}")
    public CertificateResponse getCertificate(
        @PathVariable Long hospitalId) {

        return new CertificateResponse(
                service.getCertificateLink(hospitalId));
    }

    @GetMapping("/me")
    public Hospital getCurrentHospital(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Not authenticated");
        }
        return service.getCurrentHospital(authentication.getName());
    }

    @PutMapping("/profile")
    public Hospital updateHospitalProfile(
            @RequestBody SignupRequest request,
            org.springframework.security.core.Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Not authenticated");
        }
        return service.updateHospitalProfile(authentication.getName(), request);
    }
}