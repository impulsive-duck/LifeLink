package com.bbms.blood_bank_management.donor.dto.donationrequest;

import java.time.LocalDateTime;

import com.bbms.blood_bank_management.donor.enums.DonationRequestStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequestResponse {

    private Long donationRequestId;

    private Long donorId;

    private Long bloodBankId;

    private Long hospitalId;

    private Long bloodRequestId;

    private DonationRequestStatus status;

    private LocalDateTime requestDate;

    private LocalDateTime responseDate;

    private String donorName;

    private String bloodGroup;

    private String hospitalName;

    private String contactNumber;

    public DonationRequestResponse(Long donationRequestId, Long donorId, Long bloodBankId, Long hospitalId, Long bloodRequestId, DonationRequestStatus status, LocalDateTime requestDate, LocalDateTime responseDate) {
        this.donationRequestId = donationRequestId;
        this.donorId = donorId;
        this.bloodBankId = bloodBankId;
        this.hospitalId = hospitalId;
        this.bloodRequestId = bloodRequestId;
        this.status = status;
        this.requestDate = requestDate;
        this.responseDate = responseDate;
    }
}