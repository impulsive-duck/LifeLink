package com.bbms.blood_bank_management.inventory.service;

import com.bbms.blood_bank_management.inventory.dto.InventoryRequest;
import com.bbms.blood_bank_management.inventory.entity.Inventory;
import java.util.List;

public interface InventoryService {

    Inventory addStock(InventoryRequest request);
    Inventory addStock(InventoryRequest request, String authenticatedEmail);
    List<Inventory> getInventoryByBloodBank(String email);
    Inventory updateStock(Long inventoryId, Integer unitsAvailable);
    void deleteStock(Long inventoryId);
}