package com.bbms.blood_bank_management.hospitalauth.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "hospitals")
@Data
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hospitalName;

    @Column(unique = true)
    private String licenseNumber;

    @Column(unique = true)
    private String abdmHfrId;

    private String type;

    @Column(length = 1000)
    private String address;

    private Double latitude;

    private Double longitude;

    @Column(unique = true)
    private String officialHospitalEmail;

    @Column(unique = true)
    private String hospitalContactNumber;

    private String registrantName;

    private String designation;

    @Column(unique = true)
    private String employeeId;

    @Column(unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String email;

    private String licenseCertificateLink;

    @Column(nullable = false)
    private Boolean isVerified = false;

    private String password;
}