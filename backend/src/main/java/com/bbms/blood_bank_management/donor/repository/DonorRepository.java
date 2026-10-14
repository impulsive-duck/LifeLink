package com.bbms.blood_bank_management.donor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.enums.AvailabilityStatus;
import com.bbms.blood_bank_management.donor.enums.BloodGroup;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByUsername(String username);
    Optional<Donor> findByUsernameIgnoreCase(String username);

    Optional<Donor> findByEmail(String email);
    Optional<Donor> findByEmailIgnoreCase(String email);
    Optional<Donor> findByMobileNumber(String mobileNumber);

    List<Donor> findByBloodBankIdAndBloodGroup(
            Long bloodBankId,
            BloodGroup bloodGroup
    );

    List<Donor> findByBloodBankIdAndBloodGroupAndAvailabilityStatus(
            Long bloodBankId,
            BloodGroup bloodGroup,
            AvailabilityStatus availabilityStatus
    );
    List<Donor> findByBloodGroupAndAvailabilityStatus(
            BloodGroup bloodGroup,
            AvailabilityStatus availabilityStatus
    );

    boolean existsByUsername(String username);

    boolean existsByMobileNumber(String mobileNumber);

    boolean existsByEmail(String email);
}