package com.bbms.blood_bank_management.donor.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.bloodbank.entity.BloodBank;
import com.bbms.blood_bank_management.bloodbank.repository.BloodBankRepository;
import com.bbms.blood_bank_management.donor.dto.donationrequest.DonationRequestActionResponse;
import com.bbms.blood_bank_management.donor.dto.donationrequest.DonationRequestResponse;
import com.bbms.blood_bank_management.donor.entity.DonationRequest;
import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.enums.DonationRequestStatus;
import com.bbms.blood_bank_management.donor.repository.DonationRequestRepository;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.service.DonationRequestService;
import com.bbms.blood_bank_management.hospitalauth.entity.Hospital;
import com.bbms.blood_bank_management.hospitalauth.repository.HospitalRepository;
import com.bbms.blood_bank_management.hospitalauth.repository.BloodRequestRepository;

@Service
public class DonationRequestServiceImpl implements DonationRequestService {

    private final DonationRequestRepository donationRequestRepository;
    private final DonorRepository donorRepository;
    private final BloodBankRepository bloodBankRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public DonationRequestServiceImpl(
            DonationRequestRepository donationRequestRepository,
            DonorRepository donorRepository,
            BloodBankRepository bloodBankRepository,
            HospitalRepository hospitalRepository,
            BloodRequestRepository bloodRequestRepository) {

        this.donationRequestRepository = donationRequestRepository;
        this.donorRepository = donorRepository;
        this.bloodBankRepository = bloodBankRepository;
        this.hospitalRepository = hospitalRepository;
        this.bloodRequestRepository = bloodRequestRepository;
    }

    @Override
    public List<DonationRequestResponse> getDonationRequestsForBloodBank(String email) {
        if (email != null && !email.isBlank()) {
            java.util.Optional<BloodBank> bbOpt = bloodBankRepository.findByEmail(email);
            if (bbOpt.isPresent()) {
                return donationRequestRepository.findByBloodBankId(bbOpt.get().getId())
                        .stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
            }
        }
        return donationRequestRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DonationRequestResponse> getDonationRequestsForHospital(String email) {
        if (email != null && !email.isBlank()) {
            String idClean = email.trim();
            java.util.Optional<Hospital> hospOpt = hospitalRepository.findByEmailIgnoreCase(idClean)
                    .or(() -> hospitalRepository.findByOfficialHospitalEmailIgnoreCase(idClean))
                    .or(() -> hospitalRepository.findByPhoneNumber(idClean));
            if (hospOpt.isPresent()) {
                return donationRequestRepository.findByHospitalIdOrderByRequestDateDesc(hospOpt.get().getId())
                        .stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
            }
        }
        return java.util.Collections.emptyList();
    }

    @Override
    public List<DonationRequestResponse> getMyDonationRequests(String username) {

        Donor donor = getDonorByUsername(username);

        return donationRequestRepository
                .findByDonorId(donor.getDonorId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DonationRequestResponse> getMyPendingDonationRequests(
            String username) {

        Donor donor = getDonorByUsername(username);

        return donationRequestRepository
                .findByDonorIdAndStatus(
                        donor.getDonorId(),
                        DonationRequestStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DonationRequestResponse getMyDonationRequest(
            String username,
            Long donationRequestId) {

        Donor donor = getDonorByUsername(username);

        DonationRequest request = donationRequestRepository
                .findByDonationRequestIdAndDonorId(
                        donationRequestId,
                        donor.getDonorId())
                .orElseThrow(() ->
                        new RuntimeException("Donation request not found"));

        return mapToResponse(request);
    }

    @Override
    public DonationRequestActionResponse acceptDonationRequest(
            String username,
            Long donationRequestId) {

        Donor donor = getDonorByUsername(username);

        DonationRequest request = getRequestForDonor(
                donationRequestId,
                donor.getDonorId());

        validatePendingRequest(request);

        request.setStatus(DonationRequestStatus.ACCEPTED);
        request.setResponseDate(LocalDateTime.now());

        donationRequestRepository.save(request);

        return new DonationRequestActionResponse(
                request.getDonationRequestId(),
                request.getStatus(),
                "Donation request accepted successfully");
    }

    @Override
    public DonationRequestActionResponse rejectDonationRequest(
            String username,
            Long donationRequestId) {

        Donor donor = getDonorByUsername(username);

        DonationRequest request = getRequestForDonor(
                donationRequestId,
                donor.getDonorId());

        validatePendingRequest(request);

        request.setStatus(DonationRequestStatus.REJECTED);
        request.setResponseDate(LocalDateTime.now());

        donationRequestRepository.save(request);

        return new DonationRequestActionResponse(
                request.getDonationRequestId(),
                request.getStatus(),
                "Donation request rejected successfully");
    }

    private Donor getDonorByUsername(String username) {

        return donorRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Donor not found"));
    }

    private DonationRequest getRequestForDonor(
            Long donationRequestId,
            Long donorId) {

        return donationRequestRepository
                .findByDonationRequestIdAndDonorId(
                        donationRequestId,
                        donorId)
                .orElseThrow(() ->
                        new RuntimeException("Donation request not found"));
    }

    private void validatePendingRequest(
            DonationRequest request) {

        if (request.getStatus() != DonationRequestStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending donation requests can be accepted or rejected");
        }
    }

    private DonationRequestResponse mapToResponse(
            DonationRequest request) {

        DonationRequestResponse resp = new DonationRequestResponse(
                request.getDonationRequestId(),
                request.getDonorId(),
                request.getBloodBankId(),
                request.getHospitalId(),
                request.getBloodRequestId(),
                request.getStatus(),
                request.getRequestDate(),
                request.getResponseDate()
        );

        if (request.getDonorId() != null) {
            donorRepository.findById(request.getDonorId()).ifPresent(d -> {
                resp.setDonorName(d.getFullName());
                resp.setContactNumber(d.getMobileNumber());
                if (d.getBloodGroup() != null) {
                    resp.setBloodGroup(d.getBloodGroup().name().replace("_POSITIVE", "+").replace("_NEGATIVE", "-"));
                }
            });
        }

        if (request.getHospitalId() != null) {
            hospitalRepository.findById(request.getHospitalId()).ifPresent(h -> {
                resp.setHospitalName(h.getHospitalName());
            });
        }

        return resp;
    }
}