package com.bbms.blood_bank_management.inventory.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.bloodbank.entity.BloodBank;
import com.bbms.blood_bank_management.bloodbank.repository.BloodBankRepository;
import com.bbms.blood_bank_management.inventory.dto.InventoryRequest;
import com.bbms.blood_bank_management.inventory.entity.Inventory;
import com.bbms.blood_bank_management.inventory.repository.InventoryRepository;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private BloodBankRepository bloodBankRepository;

    private static final String[][] DEFAULT_BLOOD_GROUPS = {
        {"A+", "0"},
        {"A-", "0"},
        {"B+", "0"},
        {"B-", "0"},
        {"O+", "0"},
        {"O-", "0"},
        {"AB+", "0"},
        {"AB-", "0"}
    };

    @Override
    public Inventory addStock(InventoryRequest request) {
        return addStock(request, null);
    }

    @Override
    public Inventory addStock(InventoryRequest request, String authenticatedEmail) {
        BloodBank bloodBank = null;
        if (request.getBloodBankId() != null) {
            bloodBank = bloodBankRepository.findById(request.getBloodBankId()).orElse(null);
        }
        if (bloodBank == null && authenticatedEmail != null && !authenticatedEmail.isBlank()) {
            bloodBank = bloodBankRepository.findByEmail(authenticatedEmail).orElse(null);
        }
        if (bloodBank == null) {
            throw new RuntimeException("Blood Bank Not Found. Please sign in again.");
        }

        if (request.getUnitsAvailable() == null || request.getUnitsAvailable() < 0) {
            throw new RuntimeException("Stock units cannot be negative");
        }

        String group = request.getBloodGroup() != null ? request.getBloodGroup().trim().toUpperCase() : "";
        if (group.isEmpty()) {
            throw new RuntimeException("Blood group is required");
        }

        List<Inventory> existing = inventoryRepository.findByBloodBank_IdAndBloodGroup(bloodBank.getId(), group);
        if (existing != null && !existing.isEmpty()) {
            Inventory inv = existing.get(0);
            int totalUnits = existing.stream().mapToInt(Inventory::getUnitsAvailable).sum();
            inv.setUnitsAvailable(totalUnits + request.getUnitsAvailable());
            Inventory saved = inventoryRepository.save(inv);

            // Clean up any extra duplicates
            for (int i = 1; i < existing.size(); i++) {
                inventoryRepository.delete(existing.get(i));
            }
            return saved;
        }

        Inventory inventory = new Inventory();
        inventory.setBloodBank(bloodBank);
        inventory.setBloodGroup(group);
        inventory.setUnitsAvailable(request.getUnitsAvailable());

        return inventoryRepository.save(inventory);
    }

    @Override
    public List<Inventory> getInventoryByBloodBank(String email) {
        BloodBank bloodBank = bloodBankRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Blood Bank Not Found"));

        List<Inventory> list = inventoryRepository.findByBloodBank_Id(bloodBank.getId());
        if (list == null || list.isEmpty()) {
            list = seedDefaultInventory(bloodBank);
        } else {
            // Deduplicate if multiple exist per group
            list = consolidateInventoryList(bloodBank, list);
        }

        return list;
    }

    private List<Inventory> consolidateInventoryList(BloodBank bloodBank, List<Inventory> list) {
        for (String[] item : DEFAULT_BLOOD_GROUPS) {
            String group = item[0];
            List<Inventory> forGroup = inventoryRepository.findByBloodBank_IdAndBloodGroup(bloodBank.getId(), group);
            if (forGroup != null && forGroup.size() > 1) {
                Inventory main = forGroup.get(0);
                int sum = forGroup.stream().mapToInt(Inventory::getUnitsAvailable).sum();
                main.setUnitsAvailable(sum);
                inventoryRepository.save(main);
                for (int i = 1; i < forGroup.size(); i++) {
                    inventoryRepository.delete(forGroup.get(i));
                }
            }
        }
        return inventoryRepository.findByBloodBank_Id(bloodBank.getId());
    }

    public List<Inventory> seedDefaultInventory(BloodBank bloodBank) {
        List<Inventory> seeded = new ArrayList<>();
        for (String[] item : DEFAULT_BLOOD_GROUPS) {
            String group = item[0];
            int units = Integer.parseInt(item[1]);

            Inventory inv = new Inventory();
            inv.setBloodBank(bloodBank);
            inv.setBloodGroup(group);
            inv.setUnitsAvailable(units);
            seeded.add(inventoryRepository.save(inv));
        }
        return seeded;
    }

    @Override
    public Inventory updateStock(Long inventoryId, Integer unitsAvailable) {
        Inventory inventory = inventoryRepository
                .findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory Not Found"));

        inventory.setUnitsAvailable(unitsAvailable);
        return inventoryRepository.save(inventory);
    }

    @Override
    public void deleteStock(Long inventoryId) {
        Inventory inventory = inventoryRepository
                .findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory Not Found"));

        inventoryRepository.delete(inventory);
    }
}