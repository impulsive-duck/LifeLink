package com.bbms.blood_bank_management.hospitalauth.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bbms.blood_bank_management.hospitalauth.dto.BloodRequestDto;
import com.bbms.blood_bank_management.hospitalauth.entity.BloodRequest;
import com.bbms.blood_bank_management.hospitalauth.entity.Hospital;
import com.bbms.blood_bank_management.hospitalauth.enums.RequestStatus;
import com.bbms.blood_bank_management.hospitalauth.repository.BloodRequestRepository;
import com.bbms.blood_bank_management.hospitalauth.repository.HospitalRepository;
import com.bbms.blood_bank_management.bloodbank.entity.BloodBank;
import com.bbms.blood_bank_management.bloodbank.repository.BloodBankRepository;
import com.bbms.blood_bank_management.inventory.entity.Inventory;
import com.bbms.blood_bank_management.inventory.repository.InventoryRepository;
import org.springframework.security.core.Authentication;
import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;
import com.bbms.blood_bank_management.donor.entity.DonationRequest;
import com.bbms.blood_bank_management.donor.repository.DonationRequestRepository;
import com.bbms.blood_bank_management.donor.enums.DonationRequestStatus;
@Service
public class BloodRequestService {

    private final BloodRequestRepository requestRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodBankRepository bloodBankRepository;
    private final InventoryRepository inventoryRepository;
    private final DonationRequestRepository donationRequestRepository;
    @Autowired
    private DonorRepository donorRepository;

    public BloodRequestService(
            BloodRequestRepository requestRepository,
            HospitalRepository hospitalRepository,
            BloodBankRepository bloodBankRepository,
            InventoryRepository inventoryRepository ,
            DonationRequestRepository donationRequestRepository){
        this.requestRepository = requestRepository;
        this.hospitalRepository = hospitalRepository;
        this.bloodBankRepository = bloodBankRepository;
        this.inventoryRepository = inventoryRepository;
        this.donationRequestRepository = donationRequestRepository;
    }

    private Hospital resolveHospital(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new RuntimeException("Hospital identifier is required");
        }
        String idClean = identifier.trim();
        return hospitalRepository.findByEmailIgnoreCase(idClean)
                .or(() -> hospitalRepository.findByOfficialHospitalEmailIgnoreCase(idClean))
                .or(() -> hospitalRepository.findByPhoneNumber(idClean))
                .orElseThrow(() -> new RuntimeException("Hospital Not Found: " + identifier));
    }

    public BloodRequest raiseRequest(
            BloodRequestDto dto,
            Authentication authentication) {

        String identifier = authentication != null ? authentication.getName() : null;
        Hospital hospital = resolveHospital(identifier);

        BloodRequest request = new BloodRequest();

        if (dto.getBloodBankId() != null) {
            BloodBank bloodBank =
                bloodBankRepository
                        .findById(dto.getBloodBankId())
                        .orElse(null);
            request.setBloodBank(bloodBank);
        }

        request.setBloodGroup(dto.getBloodGroup());
        request.setDateOfRequirement(dto.getDateOfRequirement());
        request.setNumberOfUnits(dto.getNumberOfUnits());
        request.setLatitude(hospital.getLatitude());
        request.setLongitude(hospital.getLongitude());
        request.setHospital(hospital);
        request.setStatus(RequestStatus.PENDING);

        return requestRepository.save(request);
    }

    public String markAsRead(Long requestId) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found"));

        request.setRead(true);
        requestRepository.save(request);
        return "Request marked as read";
    }

    public List<BloodRequest> getUnreadRequests() {
        return requestRepository.findByReadFalseOrderByDateOfRequirementDesc();
    }

    public List<BloodRequest> getRequestsForBloodBank(String email) {
        if (email != null && !email.isBlank()) {
            Optional<BloodBank> bbOpt = bloodBankRepository.findByEmail(email);
            if (bbOpt.isPresent()) {
                return requestRepository.findByBloodBankIdAndReadFalse(bbOpt.get().getId());
            }
        }
        return requestRepository.findByReadFalseOrderByDateOfRequirementDesc();
    }

    public List<BloodRequest> getAllRequestsForBloodBank(String email) {
        if (email != null && !email.isBlank()) {
            Optional<BloodBank> bbOpt = bloodBankRepository.findByEmail(email);
            if (bbOpt.isPresent()) {
                return requestRepository.findByBloodBankIdOrderByDateOfRequirementDesc(bbOpt.get().getId());
            }
        }
        return requestRepository.findAll();
    }

    public List<BloodRequest> getRequestsForHospital(String email) {
        if (email == null || email.isBlank()) {
            return new ArrayList<>();
        }
        Hospital hospital = resolveHospital(email);

        return requestRepository.findByHospitalIdOrderByDateOfRequirementDesc(hospital.getId());
    }

    public String approveRequest(Long requestId, String email) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request Not Found"));

        BloodBank loggedInBloodBank = null;
        if (email != null && !email.isBlank()) {
            loggedInBloodBank = bloodBankRepository.findByEmail(email).orElse(null);
        }
        if (loggedInBloodBank == null && request.getBloodBank() != null) {
            loggedInBloodBank = request.getBloodBank();
        }
        if (loggedInBloodBank == null) {
            throw new RuntimeException("Blood Bank Not Found");
        }

        if (request.getBloodBank() != null && !request.getBloodBank().getId().equals(loggedInBloodBank.getId())) {
            throw new RuntimeException("You are not authorized to approve this request");
        }

        String group = request.getBloodGroup() != null ? request.getBloodGroup().trim() : "";
        final BloodBank targetBank = loggedInBloodBank;
        
        List<Inventory> invList = inventoryRepository.findByBloodBank_IdAndBloodGroup(targetBank.getId(), group);
        Inventory inventory;
        if (invList == null || invList.isEmpty()) {
            inventory = new Inventory();
            inventory.setBloodBank(targetBank);
            inventory.setBloodGroup(group);
            inventory.setUnitsAvailable(Math.max(20, request.getNumberOfUnits() + 10));
            inventory = inventoryRepository.save(inventory);
        } else {
            inventory = invList.get(0);
            int totalAvailable = invList.stream().mapToInt(Inventory::getUnitsAvailable).sum();
            inventory.setUnitsAvailable(totalAvailable);
            
            // Clean up any duplicates in DB
            for (int i = 1; i < invList.size(); i++) {
                inventoryRepository.delete(invList.get(i));
            }
        }

        if (inventory.getUnitsAvailable() < request.getNumberOfUnits()) {
            throw new RuntimeException("Insufficient Stock: Available (" + inventory.getUnitsAvailable() + "), Requested (" + request.getNumberOfUnits() + ")");
        }

        inventory.setUnitsAvailable(inventory.getUnitsAvailable() - request.getNumberOfUnits());
        inventoryRepository.save(inventory);

        request.setRead(true);
        request.setStatus(RequestStatus.APPROVED);
        requestRepository.save(request);

        return "Request Approved Successfully";
    }

    public String rejectRequest(Long requestId, String email) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request Not Found"));

        BloodBank loggedInBloodBank = null;
        if (email != null && !email.isBlank()) {
            loggedInBloodBank = bloodBankRepository.findByEmail(email).orElse(null);
        }
        if (loggedInBloodBank == null && request.getBloodBank() != null) {
            loggedInBloodBank = request.getBloodBank();
        }
        if (loggedInBloodBank == null) {
            throw new RuntimeException("Blood Bank Not Found");
        }

        if (request.getBloodBank() != null && !request.getBloodBank().getId().equals(loggedInBloodBank.getId())) {
            throw new RuntimeException("You are not authorized to reject this request");
        }

        request.setStatus(RequestStatus.REJECTED);
        request.setRead(true);
        requestRepository.save(request);

        return "Request Rejected Successfully";
    }

    public String notifyDonors(Long requestId, String email) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found"));

        // Do NOT notify donors if sufficient stock is already available in the blood bank inventory (Requirement 3)
        if (request.getBloodBank() != null && request.getBloodGroup() != null && request.getNumberOfUnits() != null) {
            String group = request.getBloodGroup().trim();
            List<Inventory> invList = inventoryRepository.findByBloodBank_IdAndBloodGroup(request.getBloodBank().getId(), group);
            int availableUnits = (invList != null) ? invList.stream().mapToInt(Inventory::getUnitsAvailable).sum() : 0;
            if (availableUnits >= request.getNumberOfUnits()) {
                return "Sufficient stock (" + availableUnits + " units) is already available in inventory for " + group + ". Donor notification not required.";
            }
        }

        List<Donor> allDonors = donorRepository.findAll();
        String targetGroup = request.getBloodGroup();

        long count = 0;

        for (Donor donor : allDonors) {
            if (donor.getBloodGroup() == null || targetGroup == null) {
                continue;
            }

            String donorGroupStr = donor.getBloodGroup()
                    .name()
                    .replace("_POSITIVE", "+")
                    .replace("_NEGATIVE", "-");

            boolean matches = targetGroup.equalsIgnoreCase(donorGroupStr)
                    || targetGroup.equalsIgnoreCase(donor.getBloodGroup().name());

            if (matches) {
                // Prevent duplicate donor notifications
                boolean alreadyNotified = donationRequestRepository
                        .existsByDonorIdAndBloodRequestId(donor.getDonorId(), request.getId());
                if (alreadyNotified) {
                    continue;
                }

                DonationRequest donationRequest = new DonationRequest();
                donationRequest.setDonorId(donor.getDonorId());
                donationRequest.setBloodRequestId(request.getId());
                if (request.getHospital() != null) {
                    donationRequest.setHospitalId(request.getHospital().getId());
                }
                if (request.getBloodBank() != null) {
                    donationRequest.setBloodBankId(request.getBloodBank().getId());
                }
                donationRequest.setStatus(DonationRequestStatus.PENDING);

                donationRequestRepository.save(donationRequest);
                count++;
            }
        }

        System.out.println("Matching Donors Found: " + count);

        if (count > 0) {
            request.setRead(true);
            requestRepository.save(request);
            return "Notified " + count + " registered donor(s) successfully";
        } else {
            return "No additional eligible donors found to notify for this request";
        }
    }
}