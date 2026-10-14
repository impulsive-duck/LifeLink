package com.bbms.blood_bank_management.donor.dto.auth;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class DonorLoginResponse {

private String token;

private String username;

private String fullName;

private String message;

}