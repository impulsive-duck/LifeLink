package com.bbms.blood_bank_management.hospitalauth.controller;
import java.util.*;
import com.bbms.blood_bank_management.hospitalauth.dto.BloodRequestDto;
import com.bbms.blood_bank_management.hospitalauth.entity.BloodRequest;
import com.bbms.blood_bank_management.hospitalauth.service.BloodRequestService;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {

    private final BloodRequestService service;

    public BloodRequestController(
            BloodRequestService service) {
        this.service = service;
    }

    @PostMapping
    public BloodRequest createRequest(
            @RequestBody BloodRequestDto dto,
            Authentication authentication) {

        return service.raiseRequest(
                dto,
                authentication);
    }

    @PutMapping("/mark-as-read/{requestId}")
    public String markAsRead(
            @PathVariable Long requestId) {
                System.out.println("MARK AS READ API HIT : " + requestId);

        return service.markAsRead(requestId);
    }

    @GetMapping("/unread")
    public List<BloodRequest> getUnreadRequests() {
        System.out.println("UNREAD API HIT");

        return service.getUnreadRequests();
    }

    @GetMapping("/bloodbank")
    public ResponseEntity<List<BloodRequest>> getRequestsForBloodBank(
            Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(
                service.getRequestsForBloodBank(email));
    }

    @GetMapping("/bloodbank/all")
    public ResponseEntity<List<BloodRequest>> getAllRequestsForBloodBank(
            Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(
                service.getAllRequestsForBloodBank(email));
    }

    @GetMapping("/my-hospital")
    public ResponseEntity<List<BloodRequest>> getMyHospitalRequests(
            Authentication authentication) {

        return ResponseEntity.ok(
                service.getRequestsForHospital(
                        authentication.getName()));
    }

@PutMapping("/{requestId}/approve")
public String approveRequest(
        @PathVariable Long requestId,
        Authentication authentication) {

    return service.approveRequest(
            requestId,
            authentication.getName());
}

@PutMapping("/{requestId}/reject")
public String rejectRequest(
        @PathVariable Long requestId,
        Authentication authentication) {

    return service.rejectRequest(
            requestId,
            authentication.getName());
}

@PutMapping("/{requestId}/notify-donors")
public String notifyDonors(
        @PathVariable Long requestId,
        Authentication authentication) {

    return service.notifyDonors(
            requestId,
            authentication.getName());
}
}