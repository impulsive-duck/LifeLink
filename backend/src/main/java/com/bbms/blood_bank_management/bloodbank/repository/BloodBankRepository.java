package com.bbms.blood_bank_management.bloodbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.bbms.blood_bank_management.bloodbank.entity.BloodBank;

@Repository
public interface BloodBankRepository extends JpaRepository<BloodBank, Long> {
    boolean existsByEmail(String email);
    boolean existsByRegistrationNumber(String registrationNumber);
    Optional<BloodBank> findByEmail(String email);
}