package com.bbms.blood_bank_management.donor.dto.profile;

import lombok.Getter;
import lombok. Setter;

import jakarta.validation.constraints.Pattern;

@Getter
@Setter
public class DonorProfileUpdateRequest {

    @Pattern(
        regexp = "^[^0-9]+$",
        message = "Full name must not contain digits"
    )
    private String fullName;

private String email;

private String mobileNumber;

private String address;

private String city;

private String state;
}