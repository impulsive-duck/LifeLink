package com.bbms.blood_bank_management.donor.service;

import java.util.List;

import com.bbms.blood_bank_management.donor.dto.donationrequest.DonationRequestActionResponse;
import com.bbms.blood_bank_management.donor.dto.donationrequest.DonationRequestResponse;

public interface DonationRequestService {

    List<DonationRequestResponse> getMyDonationRequests(String username);

    List<DonationRequestResponse> getMyPendingDonationRequests(String username);

    DonationRequestResponse getMyDonationRequest(
            String username,
            Long donationRequestId
    );

    DonationRequestActionResponse acceptDonationRequest(
            String username,
            Long donationRequestId
    );

    DonationRequestActionResponse rejectDonationRequest(
            String username,
            Long donationRequestId
    );

    List<DonationRequestResponse> getDonationRequestsForBloodBank(String email);
    List<DonationRequestResponse> getDonationRequestsForHospital(String email);
}