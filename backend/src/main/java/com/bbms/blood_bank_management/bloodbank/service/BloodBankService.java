package com.bbms.blood_bank_management.bloodbank.service;

import com.bbms.blood_bank_management.bloodbank.dto.BloodBankRegistrationRequest;
import com.bbms.blood_bank_management.bloodbank.entity.BloodBank;
import com.bbms.blood_bank_management.bloodbank.dto.BloodBankLoginResponse;
import java.util.List;
import com.bbms.blood_bank_management.bloodbank.dto.BloodBankSearchResponse;

public interface BloodBankService {

    BloodBank registerBloodBank(BloodBankRegistrationRequest request);

    BloodBankLoginResponse login(String email, String password);

    BloodBank verifyBloodBank(Long id);

    BloodBank getBloodBankById(Long id);

    List<BloodBank> getAllBloodBanks();

    BloodBank updateBloodBank(Long id, BloodBankRegistrationRequest request);

    void deleteBloodBank(Long id);

    List<BloodBankSearchResponse> searchBloodBanks(
        String bloodGroup,
        Integer unitsRequired,
        Double latitude,
        Double longitude);

        List<BloodBankSearchResponse> searchNearestBloodBanks(
        Double latitude,
        Double longitude);

}