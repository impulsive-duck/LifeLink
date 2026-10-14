package com.bbms.blood_bank_management.donor.service;

import com.bbms.blood_bank_management.donor.dto.auth.DonorLoginRequest;
import com.bbms.blood_bank_management.donor.dto.auth.DonorLoginResponse;
import com.bbms.blood_bank_management.donor.dto.auth. DonorRegisterRequest;
import com.bbms.blood_bank_management.donor.dto.auth. DonorRegisterResponse;

public interface AuthService {

DonorLoginResponse login(DonorLoginRequest request);

DonorRegisterResponse register(DonorRegisterRequest request);

}