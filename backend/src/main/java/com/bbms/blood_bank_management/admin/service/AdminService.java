package com.bbms.blood_bank_management.admin.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.admin.dto.AdminLoginResponse;
import com.bbms.blood_bank_management.admin.dto.LoginRequest;
import com.bbms.blood_bank_management.admin.entity.AdminUser;
import com.bbms.blood_bank_management.admin.repository.AdminRepository;
import com.bbms.blood_bank_management.admin.security.AdminJwtUtil;
import com.bbms.blood_bank_management.hospitalauth.entity.Hospital;
import com.bbms.blood_bank_management.hospitalauth.repository.HospitalRepository;

@Service
public class AdminService {

    private final HospitalRepository hospitalRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminJwtUtil adminJwtUtil;

    public AdminService(
            HospitalRepository hospitalRepository,
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            AdminJwtUtil adminJwtUtil) {

        this.hospitalRepository = hospitalRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminJwtUtil = adminJwtUtil;
    }

    public AdminLoginResponse login(
            LoginRequest request) {

        AdminUser admin =
                adminRepository.findByUsername(
                                request.getUsername())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admin not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword())) {

            throw new RuntimeException(
                    "Invalid password");
        }

        String token =
                adminJwtUtil.generateToken(
                        admin.getUsername());

        return new AdminLoginResponse(
                token,
                admin.getUsername(),
                admin.getRole());
    }

    public List<Hospital> getPendingHospitals() {

        return hospitalRepository
                .findByIsVerifiedFalse();
    }

    public List<Hospital> getVerifiedHospitals() {

        return hospitalRepository
                .findByIsVerifiedTrue();
    }

    public String verifyHospital(
            Long hospitalId) {

        Hospital hospital =
                hospitalRepository.findById(
                                hospitalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Hospital not found"));

        if (Boolean.TRUE.equals(
                hospital.getIsVerified())) {

            throw new RuntimeException(
                    "Hospital is already verified");
        }

        hospital.setIsVerified(true);

        hospitalRepository.save(hospital);

        return "Hospital verified successfully";
    }

    public String rejectHospital(
            Long hospitalId) {

        Hospital hospital =
                hospitalRepository.findById(
                                hospitalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Hospital not found"));

        String hospitalName =
                hospital.getHospitalName();

        hospitalRepository.delete(hospital);

        return "Hospital '" + hospitalName
                + "' rejected successfully";
    }

    public String getCertificateLink(
            Long hospitalId) {

        Hospital hospital =
                hospitalRepository.findById(
                                hospitalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Hospital not found"));

        return hospital.getLicenseCertificateLink();
    }
}