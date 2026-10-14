package com.bbms.blood_bank_management.bloodbank.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbms.blood_bank_management.bloodbank.dto.BloodBankRegistrationRequest;
import com.bbms.blood_bank_management.bloodbank.entity.BloodBank;
import com.bbms.blood_bank_management.bloodbank.service.BloodBankService;
import com.bbms.blood_bank_management.bloodbank.dto.BloodBankLoginRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
import com.bbms.blood_bank_management.bloodbank.dto.BloodBankLoginResponse;
import java.util.List;
import com.bbms.blood_bank_management.bloodbank.dto.BloodBankSearchResponse;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bloodbanks")
public class BloodBankController {
    @Autowired
    private BloodBankService bloodBankService;

    @PostMapping("/register")
        public BloodBank registerBloodBank(@Valid @RequestBody BloodBankRegistrationRequest request) {

        return bloodBankService.registerBloodBank(request);
    }

    @PostMapping("/login")
    public BloodBankLoginResponse login(@Valid @RequestBody BloodBankLoginRequest request) {

        return bloodBankService.login(
                request.getEmail(),
                request.getPassword());
    }

    @PutMapping("/verify/{id}")
    public BloodBank verifyBloodBank(@PathVariable Long id) {

        return bloodBankService.verifyBloodBank(id);
    }

    @GetMapping("/search-nearest")
public List<BloodBankSearchResponse> searchNearestBloodBanks(
        @RequestParam Double latitude,
        @RequestParam Double longitude) {

    return bloodBankService.searchNearestBloodBanks(
            latitude,
            longitude);
}

    @GetMapping("/{id}")
    public BloodBank getBloodBankById(@PathVariable Long id) {

        return bloodBankService.getBloodBankById(id);
    }

    @GetMapping
    public List<BloodBank> getAllBloodBanks() {

        return bloodBankService.getAllBloodBanks();
    }

    @PutMapping("/{id}")
    public BloodBank updateBloodBank(
            @PathVariable Long id,
            @Valid @RequestBody BloodBankRegistrationRequest request) {

        return bloodBankService.updateBloodBank(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteBloodBank(@PathVariable Long id) {

        bloodBankService.deleteBloodBank(id);
    }

    @GetMapping("/search")
public List<BloodBankSearchResponse> searchBloodBanks(
        @RequestParam String bloodGroup,
        @RequestParam Integer unitsRequired,
        @RequestParam Double latitude,
        @RequestParam Double longitude) {

    return bloodBankService.searchBloodBanks(
            bloodGroup,
            unitsRequired,
            latitude,
            longitude);
}


}