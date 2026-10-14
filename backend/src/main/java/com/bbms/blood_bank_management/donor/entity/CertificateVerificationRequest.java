package com.bbms.blood_bank_management.donor.entity;

import java.time.LocalDateTime;

import com.bbms.blood_bank_management.donor.enums.VerificationRequestStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "certificate_verification_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateVerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certificate_id", nullable = false)
    private DonationCertificate certificate;

    @Column(nullable = false)
    private Long donorId;

    @Column(nullable = false)
    private Long issuingOrganizationId;

    @Column(nullable = false)
    private String issuingOrganizationName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationRequestStatus status;

    @Column(nullable = false)
    private LocalDateTime requestedDate;

    private LocalDateTime respondedDate;

    private String rejectionReason;
}