package com.bbms.blood_bank_management.bloodbank.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class BloodBankRegistrationRequest {

    @NotBlank(message = "Blood Bank Name is required")
    @Pattern(
        regexp = "^[^0-9]+$",
        message = "Blood Bank name must not contain digits"
    )
    private String bloodBankName;

    @NotBlank(message = "Registration Number is required")
    private String registrationNumber;

    @NotBlank(message = "Blood Bank Type is required")
    private String bloodBankType;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pin Code is required")
    private String pinCode;

    @NotBlank(message = "Contact Number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Contact number must be exactly 10 digits and start with 6-9"
    )
    private String contactNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "ABDM HFR ID is required")
    private String abdmHfrId;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotBlank(message = "Authorized Person Name is required")
    private String authorizedPersonName;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotBlank(message = "Authorized Person Phone is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Authorized person phone must be exactly 10 digits and start with 6-9"
    )
    private String authorizedPersonPhone;

    @NotBlank(message = "Authorized Person Email is required")
    @Email(message = "Invalid email format")
    private String authorizedPersonEmail;

    @NotBlank(message = "Registration Certificate is required")
    private String registrationCertificate;

    private String additionalDocuments;

    @NotBlank(message = "Password is required")
    @Size(
        min = 8,
        message = "Password must contain at least 8 characters"
    )
    private String password;
}
