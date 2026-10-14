package com.bbms.blood_bank_management.donor.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DonorRegisterResponse {

private Long donorId;

private String username;

private String message;

}