package com.bbms.blood_bank_management.bloodbank.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "blood_bank")
public class BloodBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodBankName;
    @Column(unique = true)
    private String registrationNumber;
    private String bloodBankType;
    private String address;
    private String city;
    private String state;
    private String pinCode;
    private String contactNumber;
    @Column(unique = true)
    private String email;
    private String abdmHfrId;
    private Double latitude;
    private Double longitude;

    private String authorizedPersonName;
    private String designation;
    private String authorizedPersonPhone;
    private String authorizedPersonEmail;

    private String registrationCertificate;
    private String additionalDocuments;

    private String password;
    private Boolean isVerified = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}