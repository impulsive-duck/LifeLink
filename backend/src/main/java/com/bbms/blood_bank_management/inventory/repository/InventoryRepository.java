package com.bbms.blood_bank_management.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.bbms.blood_bank_management.inventory.entity.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByBloodBank_Id(Long bloodBankId);

    List<Inventory> findByBloodGroupAndUnitsAvailableGreaterThanEqual(
        String bloodGroup,
        Integer unitsAvailable);
    
    List<Inventory> findByBloodBank_IdAndBloodGroup(
        Long bloodBankId,
        String bloodGroup);

}