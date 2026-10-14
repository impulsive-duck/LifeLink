package com.bbms.blood_bank_management.donor.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bbms.blood_bank_management.donor.enums.CertificateVerificationStatus;
import com.bbms.blood_bank_management.bloodbank.entity.BloodBank;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
// import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "donation_certificate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long certificateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_request_id", nullable = false)
    private DonationRequest donationRequest;

    @Column(nullable = false, unique = true)
    private String certificateNumber;

    @Column(nullable = false)
    private LocalDate donationDate;

    @Column(nullable = false)
    private String issuingOrganizationName;

    /*
     * Temporary field.
     * Later this can become a proper relationship with
     * BloodBank/Hospital entity.
     */
    @Column(nullable = false)
    private Long issuingOrganizationId;

    @Column(nullable = false)
    private String certificateUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateVerificationStatus verificationStatus;

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedDate;

    private LocalDateTime verifiedDate;

    @PrePersist
    public void prePersist() {
        this.uploadedDate = LocalDateTime.now();

        if (this.verificationStatus == null) {
            this.verificationStatus =
                    CertificateVerificationStatus.PENDING_VERIFICATION;
        }
    }
}