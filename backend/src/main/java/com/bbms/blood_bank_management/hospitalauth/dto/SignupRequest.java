package com.bbms.blood_bank_management.hospitalauth.dto;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    @NotBlank(message = "Hospital name is required")
    @Pattern(
        regexp = "^[^0-9]+$",
        message = "Hospital name must not contain digits"
    )
    private String hospitalName;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @NotBlank(message = "ABDM HFR ID is required")
    private String abdmHfrId;

    @NotBlank(message = "Hospital type is required")
    private String type;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotBlank(message = "Official hospital email is required")
    @Email(message = "Invalid official hospital email format")
    private String officialHospitalEmail;

    @NotBlank(message = "Hospital contact number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Hospital contact number must be exactly 10 digits and start with 6-9"
    )
    private String hospitalContactNumber;

    @NotBlank(message = "Registrant name is required")
    private String registrantName;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Mobile number must be exactly 10 digits and start with 6-9"
    )
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Certificate link is required")
    private String licenseCertificateLink;

    @NotBlank(message = "Password is required")
    @Size(
        min = 8,
        message = "Password must contain at least 8 characters"
    )
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}