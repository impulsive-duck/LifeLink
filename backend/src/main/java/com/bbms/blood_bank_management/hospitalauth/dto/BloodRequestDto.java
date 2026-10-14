package com.bbms.blood_bank_management.hospitalauth.dto;

import java.time.LocalDate;

public class BloodRequestDto {

    private String bloodGroup;

    private LocalDate dateOfRequirement;

    private Integer numberOfUnits;

    private Long bloodBankId;

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public LocalDate getDateOfRequirement() {
        return dateOfRequirement;
    }

    public void setDateOfRequirement(LocalDate dateOfRequirement) {
        this.dateOfRequirement = dateOfRequirement;
    }

    public Integer getNumberOfUnits() {
        return numberOfUnits;
    }

    public void setNumberOfUnits(Integer numberOfUnits) {
        this.numberOfUnits = numberOfUnits;
    }

    public Long getBloodBankId() {
        return bloodBankId;
    }

    public void setBloodBankId(Long bloodBankId) {
        this.bloodBankId = bloodBankId;
    }
}