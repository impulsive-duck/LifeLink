package com.bbms.blood_bank_management.inventory.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.Authentication;

import com.bbms.blood_bank_management.inventory.dto.InventoryRequest;
import com.bbms.blood_bank_management.inventory.entity.Inventory;
import com.bbms.blood_bank_management.inventory.service.InventoryService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/bloodbank/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping
    public Inventory addStock(
            @RequestBody InventoryRequest request,
            Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;
        return inventoryService.addStock(request, email);
    }

    @GetMapping("/bloodbank")
    public List<Inventory> getInventoryByBloodBank(
            Authentication authentication) {

        return inventoryService.getInventoryByBloodBank(authentication.getName());
    }

    @PutMapping("/{id}")
    public Inventory updateStock(
            @PathVariable Long id,
            @RequestParam Integer unitsAvailable) {

        return inventoryService.updateStock(id, unitsAvailable);
    }

    @DeleteMapping("/{id}")
    public void deleteStock(@PathVariable Long id) {

        inventoryService.deleteStock(id);
    }
}