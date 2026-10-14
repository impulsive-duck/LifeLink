package com.bbms.blood_bank_management.donor.dto.auth;

import java.time.LocalDate;

import com.bbms.blood_bank_management.donor.enums.BloodGroup;
import com.bbms.blood_bank_management.donor.enums.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonorRegisterRequest {

    private long bloodBankId;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    @Pattern(
        regexp = "^[^0-9]+$",
        message = "Full name must not contain digits"
    )
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Mobile number must be exactly 10 digits and start with 6-9"
    )
    private String mobileNumber;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    private Double weight;

    private Double hemoglobin;

    private String address;

    private String city;

    private String state;
}