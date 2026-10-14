package com.bbms.blood_bank_management.donor.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.bbms.blood_bank_management.donor.enums.DonationRequestStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "donation_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationRequestId;

    @Column(nullable = false)
    private Long donorId;

    @Column(nullable = false)
    private Long bloodBankId;

    @Column(nullable = false)
    private Long hospitalId;

    @Column(nullable = false)
    private Long bloodRequestId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationRequestStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime requestDate;

    private LocalDateTime responseDate;

    @OneToMany(
        mappedBy = "donationRequest",
        cascade = CascadeType.ALL
    )
    private List<DonationCertificate> certificates;

    @PrePersist
    public void prePersist() {
        this.requestDate = LocalDateTime.now();

        if (this.status == null) {
            this.status = DonationRequestStatus.PENDING;
        }
    }
}