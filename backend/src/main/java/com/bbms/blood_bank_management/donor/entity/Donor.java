package com.bbms.blood_bank_management.donor.entity;

import com.bbms.blood_bank_management.donor.enums.AvailabilityStatus;
import com.bbms.blood_bank_management.donor.enums.BloodGroup;
import com.bbms.blood_bank_management.donor.enums.Gender;
import jakarta.persistence.*;

import java.time. LocalDate;
import java.time. LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "donor")
@Getter

@Setter

@NoArgsConstructor

@AllArgsConstructor

public class Donor {

@Id
@GeneratedValue(strategy = GenerationType. IDENTITY)
private Long donorId;

@Column(nullable = false)
private Long bloodBankId;

@Column(nullable = false, unique = true)
private String username;

@Column(nullable = false)
private String password;

@Column(nullable = false)
private String fullName;

@Column(nullable = false, unique = true)
private String email;

@Column(nullable = false, unique = true)
private String mobileNumber;

@Enumerated(EnumType.STRING)
@Column(nullable = false)
private Gender gender;

@Column(nullable = false)
private LocalDate dateOfBirth;

@Enumerated(EnumType.STRING)
@Column(nullable = false)
private BloodGroup bloodGroup;

@Column(nullable = false)
private Double weight;

@Column(nullable = false)
private Double hemoglobin;

@Column(nullable = false)
private String address;

@Column(nullable = false)
private String city;

@Column(nullable = false)
private String state;

@Column(nullable = true)
private LocalDate lastDonationDate;

@Enumerated(EnumType.STRING)
@Column(nullable = false)
private AvailabilityStatus availabilityStatus;

@Column(nullable = false)
private int donationCount;

@Column(nullable = false, updatable = false)
private LocalDateTime createdDate;

@PrePersist
public void prePersist() {
    this.createdDate = LocalDateTime.now();
}
}






