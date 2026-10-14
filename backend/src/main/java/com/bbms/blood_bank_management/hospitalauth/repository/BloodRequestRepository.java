package com.bbms.blood_bank_management.hospitalauth.repository;
import java.util.List;
import com.bbms.blood_bank_management.hospitalauth.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository
        extends JpaRepository<BloodRequest, Long> {

        List<BloodRequest> findByReadFalseOrderByDateOfRequirementDesc();

        List<BloodRequest> findByBloodBankIdAndReadFalse(Long bloodBankId);

        List<BloodRequest> findByBloodBankIdOrderByDateOfRequirementDesc(Long bloodBankId);

        List<BloodRequest> findByHospitalIdOrderByDateOfRequirementDesc(Long hospitalId);
}