package com.bbms.blood_bank_management.hospitalauth.repository;
import com.bbms.blood_bank_management.hospitalauth.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HospitalRepository

extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByEmail(String email);

    Optional<Hospital> findByEmailIgnoreCase(String email);

    Optional<Hospital> findByOfficialHospitalEmailIgnoreCase(String email);

    Optional<Hospital> findByPhoneNumber(String phoneNumber);

    List<Hospital> findByIsVerifiedFalse();

    List<Hospital> findByIsVerifiedTrue();

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByLicenseNumber(String licenseNumber);
}