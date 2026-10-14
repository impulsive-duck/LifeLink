package com.bbms.blood_bank_management.admin.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.bbms.blood_bank_management.admin.entity.AdminUser;
import com.bbms.blood_bank_management.admin.repository.AdminRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (!adminRepository.existsByUsername("admin")) {

            AdminUser admin = new AdminUser();

            admin.setUsername("admin");
            admin.setFullName(
                    "Health Authority Administrator");
            admin.setDesignation(
                    "Chief Verification Officer");

            admin.setPassword(
                    passwordEncoder.encode(
                            "Admin@123"));

            admin.setRole("ROLE_ADMIN");

            adminRepository.save(admin);

            System.out.println(
                    "Default Admin Created");
        }
    }
}