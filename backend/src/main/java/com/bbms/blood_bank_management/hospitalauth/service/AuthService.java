package com.bbms.blood_bank_management.hospitalauth.service;
import java.util.*;
import com.bbms.blood_bank_management.hospitalauth.dto.*;
import com.bbms.blood_bank_management.hospitalauth.entity.Hospital;
import com.bbms.blood_bank_management.hospitalauth.repository.HospitalRepository;
import com.bbms.blood_bank_management.hospitalauth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
// import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final HospitalRepository repository;
    private final PasswordEncoder encoder;
//     private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public String signup(SignupRequest request) {

        if(!request.getPassword()
                .equals(request.getConfirmPassword())){

            throw new RuntimeException(
                    "Passwords do not match");
        }

        if(repository.existsByEmail(
                request.getEmail())){

            throw new RuntimeException(
                    "Email already registered");
        }

        Hospital hospital = new Hospital();

        hospital.setHospitalName(
                request.getHospitalName());

        hospital.setLicenseNumber(
                request.getLicenseNumber());

        hospital.setAbdmHfrId(
                request.getAbdmHfrId());

        hospital.setType(request.getType());

        hospital.setAddress(
                request.getAddress());

        hospital.setLatitude(
                request.getLatitude());

        hospital.setLongitude(
                request.getLongitude());

        hospital.setOfficialHospitalEmail(
                request.getOfficialHospitalEmail());

        hospital.setHospitalContactNumber(
                request.getHospitalContactNumber());

        hospital.setRegistrantName(
                request.getRegistrantName());

        hospital.setDesignation(
                request.getDesignation());

        hospital.setEmployeeId(
                request.getEmployeeId());

        hospital.setPhoneNumber(
                request.getPhoneNumber());

        hospital.setEmail(
                request.getEmail());

        hospital.setLicenseCertificateLink(
                request.getLicenseCertificateLink());

        hospital.setPassword(
                encoder.encode(
                        request.getPassword()));

        hospital.setIsVerified(false);
        repository.save(hospital);

        return jwtUtil.generateToken(
                hospital.getEmail());
    }

    public String verifyHospital(Long hospitalId) {

    Hospital hospital =
            repository.findById(hospitalId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Hospital not found"));

    hospital.setIsVerified(true);

    repository.save(hospital);

    return "Hospital verified successfully";
    }

    // public String login(LoginRequest request){

    //     authenticationManager.authenticate(
    //             new UsernamePasswordAuthenticationToken(
    //                     request.getUsername(),
    //                     request.getPassword()));

    //     return jwtUtil.generateToken(
    //             request.getUsername());
    // }

    public String login(LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Email or mobile number is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        String username = request.getUsername().trim();

        Hospital hospital = repository.findByEmailIgnoreCase(username)
                .or(() -> repository.findByOfficialHospitalEmailIgnoreCase(username))
                .or(() -> repository.findByPhoneNumber(username))
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (Boolean.FALSE.equals(hospital.getIsVerified())) {
            throw new RuntimeException(
                    "Hospital verification pending. Login not allowed.");
        }

        if (!encoder.matches(request.getPassword(), hospital.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtUtil.generateToken(hospital.getEmail());
    }

    public List<Hospital> getPendingHospitals() {

        return repository.findByIsVerifiedFalse();
    }

    public String getCertificateLink(Long hospitalId) {

    Hospital hospital =
            repository.findById(hospitalId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                     "Hospital not found"));

    return hospital.getLicenseCertificateLink();
    }

    public Hospital getCurrentHospital(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Hospital identifier required");
        }
        String u = username.trim();
        return repository.findByEmailIgnoreCase(u)
                .or(() -> repository.findByOfficialHospitalEmailIgnoreCase(u))
                .or(() -> repository.findByPhoneNumber(u))
                .orElseThrow(() -> new RuntimeException("Hospital not found: " + username));
    }

    public Hospital updateHospitalProfile(String username, SignupRequest request) {
        Hospital hospital = getCurrentHospital(username);

        if (request.getHospitalName() != null && !request.getHospitalName().trim().isEmpty()) {
            if (request.getHospitalName().matches(".*\\d.*")) {
                throw new RuntimeException("Hospital name must not contain digits");
            }
            hospital.setHospitalName(request.getHospitalName().trim());
        }
        if (request.getType() != null && !request.getType().trim().isEmpty()) {
            hospital.setType(request.getType().trim());
        }
        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
            hospital.setAddress(request.getAddress().trim());
        }
        if (request.getLatitude() != null) {
            hospital.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            hospital.setLongitude(request.getLongitude());
        }
        if (request.getOfficialHospitalEmail() != null && !request.getOfficialHospitalEmail().trim().isEmpty()) {
            hospital.setOfficialHospitalEmail(request.getOfficialHospitalEmail().trim());
        }
        if (request.getHospitalContactNumber() != null && !request.getHospitalContactNumber().trim().isEmpty()) {
            hospital.setHospitalContactNumber(request.getHospitalContactNumber().trim());
        }
        if (request.getRegistrantName() != null && !request.getRegistrantName().trim().isEmpty()) {
            hospital.setRegistrantName(request.getRegistrantName().trim());
        }
        if (request.getDesignation() != null && !request.getDesignation().trim().isEmpty()) {
            hospital.setDesignation(request.getDesignation().trim());
        }
        if (request.getEmployeeId() != null && !request.getEmployeeId().trim().isEmpty()) {
            hospital.setEmployeeId(request.getEmployeeId().trim());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            hospital.setPhoneNumber(request.getPhoneNumber().trim());
        }

        return repository.save(hospital);
    }

//     public String login(LoginRequest request){

//     try {

//         authenticationManager.authenticate(
//                 new UsernamePasswordAuthenticationToken(
//                         request.getUsername(),
//                         request.getPassword()));

//         System.out.println("LOGIN SUCCESS");

//         return jwtUtil.generateToken(
//                 request.getUsername());

//     } catch (Exception ex) {

//         ex.printStackTrace();

//         throw ex;
//     }
// }
}