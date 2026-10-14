package com.bbms.blood_bank_management.donor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bbms.blood_bank_management.donor.entity.DonationRequest;
import com.bbms.blood_bank_management.donor.enums.DonationRequestStatus;

public interface DonationRequestRepository
        extends JpaRepository<DonationRequest, Long> {

    List<DonationRequest> findByDonorId(Long donorId);

    List<DonationRequest> findByDonorIdAndStatus(
            Long donorId,
            DonationRequestStatus status
    );

    Optional<DonationRequest> findByDonationRequestIdAndDonorId(
            Long donationRequestId,
            Long donorId
    );

    List<DonationRequest> findByBloodBankId(Long bloodBankId);

    List<DonationRequest> findByBloodBankIdAndStatus(
            Long bloodBankId,
            DonationRequestStatus status
    );

    boolean existsByBloodRequestId(Long bloodRequestId);
    boolean existsByDonorIdAndBloodRequestId(
        Long donorId,
        Long bloodRequestId);

    List<DonationRequest> findByHospitalId(Long hospitalId);
    List<DonationRequest> findByHospitalIdOrderByRequestDateDesc(Long hospitalId);
    List<DonationRequest> findByBloodRequestId(Long bloodRequestId);
    Optional<DonationRequest> findByBloodRequestIdAndDonorId(Long bloodRequestId, Long donorId);
}