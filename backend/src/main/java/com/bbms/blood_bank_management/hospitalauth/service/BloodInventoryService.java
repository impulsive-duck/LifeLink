package com.bbms.blood_bank_management.hospitalauth.service;

import com.bbms.blood_bank_management.hospitalauth.dto.*;
import com.bbms.blood_bank_management.hospitalauth.entity.*;
import com.bbms.blood_bank_management.hospitalauth.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BloodInventoryService {

    private final BloodInventoryRepository inventoryRepository;
    private final HospitalRepository hospitalRepository;

    public BloodInventoryService(
            BloodInventoryRepository inventoryRepository,
            HospitalRepository hospitalRepository) {

        this.inventoryRepository = inventoryRepository;
        this.hospitalRepository = hospitalRepository;
    }

    private Hospital resolveHospital(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new RuntimeException("Authentication required");
        }

        String identifier = authentication.getName().trim();

        return hospitalRepository.findByEmailIgnoreCase(identifier)
                .or(() -> hospitalRepository.findByOfficialHospitalEmailIgnoreCase(identifier))
                .or(() -> hospitalRepository.findByPhoneNumber(identifier))
                .orElseThrow(() -> new RuntimeException("Hospital Not Found: " + identifier));
    }

    public List<BloodInventory> getMyInventory(Authentication authentication) {
        Hospital hospital = resolveHospital(authentication);
        List<BloodInventory> list = inventoryRepository.findByHospitalId(hospital.getId());
        return list != null ? list : new ArrayList<>();
    }

    public BloodInventory updateInventory(
            UpdateInventoryRequest request,
            Authentication authentication) {

        if (request.getUnits() == null || request.getUnits() < 0) {
            throw new RuntimeException("Units cannot be negative");
        }

        Hospital hospital = resolveHospital(authentication);

        String bloodGroup = request.getBloodGroup() != null ? request.getBloodGroup().trim().toUpperCase() : "";
        if (bloodGroup.isEmpty()) {
            throw new RuntimeException("Blood group is required");
        }

        BloodInventory inventory = inventoryRepository
                .findByHospitalIdAndBloodGroup(hospital.getId(), bloodGroup)
                .orElse(new BloodInventory());

        inventory.setHospital(hospital);
        inventory.setBloodGroup(bloodGroup);
        inventory.setUnits(request.getUnits());

        return inventoryRepository.save(inventory);
    }
}