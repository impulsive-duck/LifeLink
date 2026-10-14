package com.bbms.blood_bank_management.hospitalauth.controller;

import com.bbms.blood_bank_management.hospitalauth.dto.UpdateInventoryRequest;
import com.bbms.blood_bank_management.hospitalauth.entity.BloodInventory;
import com.bbms.blood_bank_management.hospitalauth.service.BloodInventoryService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class BloodInventoryController {

    private final BloodInventoryService service;

    public BloodInventoryController(
            BloodInventoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<BloodInventory> getMyInventory(
            Authentication authentication) {

        return service.getMyInventory(authentication);
    }

    @PutMapping
    public BloodInventory updateInventory(
        @RequestBody UpdateInventoryRequest request,
        Authentication authentication) {

        return service.updateInventory(
            request,
            authentication);
        }
}