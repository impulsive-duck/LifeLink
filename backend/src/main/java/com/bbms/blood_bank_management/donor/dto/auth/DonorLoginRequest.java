package com.bbms.blood_bank_management.donor.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonorLoginRequest {

private String username;

private String password;
}