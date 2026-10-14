package com.bbms.blood_bank_management.hospitalauth.repository;

import com.bbms.blood_bank_management.hospitalauth.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;


import java.util.List;

public interface BloodInventoryRepository
        extends JpaRepository<BloodInventory, Long> {

    List<BloodInventory> findByHospitalId(Long hospitalId);
    Optional<BloodInventory>
findByHospitalIdAndBloodGroup(
        Long hospitalId,
        String bloodGroup);

}