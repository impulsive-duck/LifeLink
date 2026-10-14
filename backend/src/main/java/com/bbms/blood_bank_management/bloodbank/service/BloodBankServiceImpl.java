package com.bbms.blood_bank_management.bloodbank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.bloodbank.dto.BloodBankRegistrationRequest;
import com.bbms.blood_bank_management.bloodbank.entity.BloodBank;
import com.bbms.blood_bank_management.bloodbank.repository.BloodBankRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.bbms.blood_bank_management.auth.jwt.JwtUtil;
import com.bbms.blood_bank_management.bloodbank.dto.BloodBankLoginResponse;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

import com.bbms.blood_bank_management.inventory.entity.Inventory;
import com.bbms.blood_bank_management.inventory.repository.InventoryRepository;
import com.bbms.blood_bank_management.bloodbank.dto.BloodBankSearchResponse;

@Service
public class BloodBankServiceImpl implements BloodBankService {

    @Autowired
    private BloodBankRepository bloodBankRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private InventoryRepository inventoryRepository;

    private static final String[][] DEFAULT_BLOOD_GROUPS = {
        {"A+", "0"},
        {"A-", "0"},
        {"B+", "0"},
        {"B-", "0"},
        {"O+", "0"},
        {"O-", "0"},
        {"AB+", "0"},
        {"AB-", "0"}
    };

    @Override
    public BloodBank registerBloodBank(BloodBankRegistrationRequest request) {

        if (bloodBankRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (bloodBankRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new RuntimeException("Registration Number already exists");
        }

        if (request.getBloodBankName() != null && request.getBloodBankName().matches(".*\\d.*")) {
            throw new RuntimeException("Blood Bank name must not contain digits");
        }

        BloodBank bloodBank = new BloodBank();
        bloodBank.setBloodBankName(request.getBloodBankName());
        bloodBank.setRegistrationNumber(request.getRegistrationNumber());
        bloodBank.setBloodBankType(request.getBloodBankType());
        bloodBank.setAddress(request.getAddress());
        bloodBank.setCity(request.getCity());
        bloodBank.setState(request.getState());
        bloodBank.setPinCode(request.getPinCode());
        bloodBank.setContactNumber(request.getContactNumber());
        bloodBank.setEmail(request.getEmail());
        bloodBank.setAbdmHfrId(request.getAbdmHfrId());
        bloodBank.setLatitude(request.getLatitude() != null ? request.getLatitude() : 19.0760);
        bloodBank.setLongitude(request.getLongitude() != null ? request.getLongitude() : 72.8777);

        bloodBank.setAuthorizedPersonName(request.getAuthorizedPersonName());
        bloodBank.setDesignation(request.getDesignation());
        bloodBank.setAuthorizedPersonPhone(request.getAuthorizedPersonPhone());
        bloodBank.setAuthorizedPersonEmail(request.getAuthorizedPersonEmail());

        bloodBank.setRegistrationCertificate(request.getRegistrationCertificate());
        bloodBank.setAdditionalDocuments(request.getAdditionalDocuments());

        bloodBank.setPassword(passwordEncoder.encode(request.getPassword()));

        BloodBank saved = bloodBankRepository.save(bloodBank);
        // seedDefaultInventoryForBloodBank(saved);
        return saved;
    }

    private void seedDefaultInventoryForBloodBank(BloodBank bloodBank) {
        List<Inventory> existingList = inventoryRepository.findByBloodBank_Id(bloodBank.getId());
        for (String[] item : DEFAULT_BLOOD_GROUPS) {
            String group = item[0];
            int units = Integer.parseInt(item[1]);

            boolean exists = existingList.stream().anyMatch(i -> group.equalsIgnoreCase(i.getBloodGroup()));
            if (!exists) {
                Inventory inv = new Inventory();
                inv.setBloodBank(bloodBank);
                inv.setBloodGroup(group);
                inv.setUnitsAvailable(units);
                inventoryRepository.save(inv);
            }
        }
    }

    private void ensureAllBloodBanksHaveInventory() {
        List<BloodBank> allBanks = bloodBankRepository.findAll();
        for (BloodBank bank : allBanks) {
            seedDefaultInventoryForBloodBank(bank);
        }
    }

    @Override
    public BloodBankLoginResponse login(String email, String password) {

        BloodBank bloodBank = bloodBankRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if (!passwordEncoder.matches(password, bloodBank.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        if (!bloodBank.getIsVerified()) {
            throw new RuntimeException("Blood Bank is not verified yet");
        }

        String token = jwtUtil.generateToken(email);
        return new BloodBankLoginResponse(
                token,
                bloodBank.getId(),
                bloodBank.getBloodBankName(),
                bloodBank.getEmail(),
                bloodBank.getCity(),
                bloodBank.getState(),
                bloodBank.getIsVerified()
        );
    }

    @Override
    public BloodBank verifyBloodBank(Long id) {
        BloodBank bloodBank = bloodBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood Bank Not Found"));

        bloodBank.setIsVerified(true);
        BloodBank saved = bloodBankRepository.save(bloodBank);
        // seedDefaultInventoryForBloodBank(saved);
        return saved;
    }

    @Override
    public BloodBank getBloodBankById(Long id) {
        return bloodBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood Bank Not Found"));
    }

    @Override
    public List<BloodBank> getAllBloodBanks() {
        return bloodBankRepository.findAll();
    }

    @Override
    public BloodBank updateBloodBank(Long id, BloodBankRegistrationRequest request) {
        BloodBank bloodBank = bloodBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood Bank Not Found"));

        bloodBank.setBloodBankName(request.getBloodBankName());
        bloodBank.setBloodBankType(request.getBloodBankType());
        bloodBank.setAddress(request.getAddress());
        bloodBank.setCity(request.getCity());
        bloodBank.setState(request.getState());
        bloodBank.setPinCode(request.getPinCode());
        bloodBank.setContactNumber(request.getContactNumber());
        bloodBank.setAbdmHfrId(request.getAbdmHfrId());
        bloodBank.setLatitude(request.getLatitude());
        bloodBank.setLongitude(request.getLongitude());

        bloodBank.setAuthorizedPersonName(request.getAuthorizedPersonName());
        bloodBank.setDesignation(request.getDesignation());
        bloodBank.setAuthorizedPersonPhone(request.getAuthorizedPersonPhone());
        bloodBank.setAuthorizedPersonEmail(request.getAuthorizedPersonEmail());

        bloodBank.setRegistrationCertificate(request.getRegistrationCertificate());
        bloodBank.setAdditionalDocuments(request.getAdditionalDocuments());

        return bloodBankRepository.save(bloodBank);
    }

    @Override
    public void deleteBloodBank(Long id) {
        BloodBank bloodBank = bloodBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood Bank Not Found"));
        bloodBankRepository.delete(bloodBank);
    }

    @Override
    public List<BloodBankSearchResponse> searchBloodBanks(
            String bloodGroup,
            Integer unitsRequired,
            Double latitude,
            Double longitude) {

        // Ensure database has stock records initialized for all blood banks
        ensureAllBloodBanksHaveInventory();

        String normalizedGroup = bloodGroup != null ? bloodGroup.replace(" ", "+").trim().toUpperCase() : "O+";
        int units = (unitsRequired != null && unitsRequired > 0) ? unitsRequired : 1;
        double userLat = latitude != null ? latitude : 19.0760;
        double userLng = longitude != null ? longitude : 72.8777;

        List<Inventory> inventories = inventoryRepository
                .findByBloodGroupAndUnitsAvailableGreaterThanEqual(normalizedGroup, units);

        Map<Long, BloodBankSearchResponse> bankMap = new LinkedHashMap<>();
        for (Inventory inv : inventories) {
            if (inv.getBloodBank() != null) {
                BloodBank bloodBank = inv.getBloodBank();
                Long bId = bloodBank.getId();
                if (!bankMap.containsKey(bId)) {
                    double bankLat = bloodBank.getLatitude() != null ? bloodBank.getLatitude() : 19.0760;
                    double bankLng = bloodBank.getLongitude() != null ? bloodBank.getLongitude() : 72.8777;
                    Double distance = calculateDistance(userLat, userLng, bankLat, bankLng);

                    bankMap.put(bId, new BloodBankSearchResponse(
                            bId,
                            bloodBank.getBloodBankName(),
                            inv.getUnitsAvailable(),
                            Math.round(distance * 100.0) / 100.0,
                            bloodBank.getAddress(),
                            bloodBank.getCity(),
                            bloodBank.getState(),
                            bloodBank.getContactNumber(),
                            bloodBank.getEmail(),
                            bankLat,
                            bankLng
                    ));
                } else {
                    BloodBankSearchResponse existing = bankMap.get(bId);
                    existing.setAvailableUnits(Math.max(existing.getAvailableUnits(), inv.getUnitsAvailable()));
                }
            }
        }

        return bankMap.values().stream()
                .sorted(Comparator.comparing(BloodBankSearchResponse::getDistanceKm))
                .collect(Collectors.toList());
    }

    private double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final int EARTH_RADIUS = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    @Override
    public List<BloodBankSearchResponse> searchNearestBloodBanks(
            Double latitude,
            Double longitude) {

        ensureAllBloodBanksHaveInventory();

        double userLat = latitude != null ? latitude : 19.0760;
        double userLng = longitude != null ? longitude : 72.8777;

        return bloodBankRepository.findAll()
                .stream()
                .map(bloodBank -> {
                    double bankLat = bloodBank.getLatitude() != null ? bloodBank.getLatitude() : 19.0760;
                    double bankLng = bloodBank.getLongitude() != null ? bloodBank.getLongitude() : 72.8777;

                    Double distance = calculateDistance(userLat, userLng, bankLat, bankLng);

                    return new BloodBankSearchResponse(
                            bloodBank.getId(),
                            bloodBank.getBloodBankName(),
                            0,
                            Math.round(distance * 100.0) / 100.0,
                            bloodBank.getAddress(),
                            bloodBank.getCity(),
                            bloodBank.getState(),
                            bloodBank.getContactNumber(),
                            bloodBank.getEmail(),
                            bankLat,
                            bankLng);
                })
                .sorted(Comparator.comparing(BloodBankSearchResponse::getDistanceKm))
                .collect(Collectors.toList());
    }
}