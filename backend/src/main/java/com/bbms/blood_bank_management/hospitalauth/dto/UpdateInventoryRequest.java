package com.bbms.blood_bank_management.hospitalauth.dto;

public class UpdateInventoryRequest {

    private String bloodGroup;
    private Integer units;

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getUnits() {
        return units;
    }

    public void setUnits(Integer units) {
        this.units = units;
    }
}