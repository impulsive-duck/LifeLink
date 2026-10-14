package com.bbms.blood_bank_management.donor.dto.search;

// import java.time.LocalDate;

import com.bbms.blood_bank_management.donor.enums.BloodGroup;
import com.bbms.blood_bank_management.donor.enums.Gender;
import com.bbms.blood_bank_management.donor.enums.AvailabilityStatus;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonorSearchResponse {

    private Long donorId;

    private String fullName;

    private String mobileNumber;

    private String email;

    private BloodGroup bloodGroup;

    private Gender gender;

    private String city;

    private String state;

    private Integer age;

    private Double weight;

    private Double hemoglobin;

    private AvailabilityStatus availabilityStatus;

    private boolean eligible;
}