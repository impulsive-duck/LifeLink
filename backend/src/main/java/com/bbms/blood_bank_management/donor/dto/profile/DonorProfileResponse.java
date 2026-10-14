package com.bbms.blood_bank_management.donor.dto.profile;

import java.time. LocalDate;
import java. time. LocalDateTime;

import com.bbms.blood_bank_management.donor.enums.AvailabilityStatus;
import com.bbms.blood_bank_management.donor.enums.BloodGroup;
import com.bbms.blood_bank_management.donor.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok. Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonorProfileResponse {

private Long donorId;

private Long bloodBankId;

private String username;

private String fullName;

private String email;

private String mobileNumber;

private Gender gender;

private LocalDate dateofBirth;

private BloodGroup bloodGroup;

private Double weight;

private Double hemoglobin;

private String address;

private String city;

private String state;

private LocalDate lastDonationDate;

private AvailabilityStatus availabilityStatus;

private int donationCount;

private LocalDateTime createdDate;
}