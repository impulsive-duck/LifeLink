package com.bbms.blood_bank_management.donor.service;

import com.bbms.blood_bank_management.donor.dto.profile.DonorProfileResponse;
import com.bbms.blood_bank_management.donor.dto.profile.DonorProfileUpdateRequest;

public interface DonorProfileService {

DonorProfileResponse getProfile(String username);

DonorProfileResponse updateProfile(
String username,
DonorProfileUpdateRequest request
);
}