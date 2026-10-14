package com.bbms.blood_bank_management.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodBankLoginResponse {

    private String token;
    private Long id;
    private String bloodBankName;
    private String email;
    private String city;
    private String state;
    private Boolean isVerified;

    public BloodBankLoginResponse(String token) {
        this.token = token;
    }
}