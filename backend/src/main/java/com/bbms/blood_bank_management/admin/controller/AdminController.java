package com.bbms.blood_bank_management.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.bbms.blood_bank_management.admin.dto.AdminLoginResponse;
import com.bbms.blood_bank_management.admin.dto.LoginRequest;

import com.bbms.blood_bank_management.admin.service.AdminService;
import com.bbms.blood_bank_management.hospitalauth.entity.Hospital;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService) {

        this.adminService = adminService;
    }

    @PostMapping("/login")
public ResponseEntity<AdminLoginResponse>
login(
        @RequestBody LoginRequest request) {

    return ResponseEntity.ok(
            adminService.login(request));
}

    @GetMapping("/pending-hospitals")
    public ResponseEntity<List<Hospital>>
    getPendingHospitals() {

        return ResponseEntity.ok(
                adminService.getPendingHospitals());
    }

    @GetMapping("/verified-hospitals")
    public ResponseEntity<List<Hospital>>
    getVerifiedHospitals() {

        return ResponseEntity.ok(
                adminService.getVerifiedHospitals());
    }

    @PutMapping("/verify/{hospitalId}")
    public ResponseEntity<Map<String, String>>
    verifyHospital(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        adminService.verifyHospital(
                                hospitalId)));
    }

    @DeleteMapping("/reject/{hospitalId}")
    public ResponseEntity<Map<String, String>>
    rejectHospital(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        adminService.rejectHospital(
                                hospitalId)));
    }

    @GetMapping("/certificate/{hospitalId}")
    public ResponseEntity<Map<String, String>>
    getCertificate(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                Map.of(
                        "certificateLink",
                        adminService.getCertificateLink(
                                hospitalId)));
    }
}