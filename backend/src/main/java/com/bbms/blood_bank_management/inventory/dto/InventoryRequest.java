package com.bbms.blood_bank_management.inventory.dto;

import lombok.Data;

@Data
public class InventoryRequest {

    private Long bloodBankId;

    private String bloodGroup;

    private Integer unitsAvailable;
}