package com.bbms.blood_bank_management.hospitalauth.security;

import com.bbms.blood_bank_management.hospitalauth.entity.Hospital;
import com.bbms.blood_bank_management.hospitalauth.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final HospitalRepository repository;

    @Override
    public UserDetails loadUserByUsername(
            String username)
            throws UsernameNotFoundException {

        if (username == null || username.trim().isEmpty()) {
            throw new UsernameNotFoundException("Hospital username required");
        }

        String u = username.trim();

        Hospital hospital = repository.findByEmailIgnoreCase(u)
                .or(() -> repository.findByOfficialHospitalEmailIgnoreCase(u))
                .or(() -> repository.findByPhoneNumber(u))
                .orElseThrow(() -> new UsernameNotFoundException("Hospital Not Found: " + username));

        return User.builder()
                .username(hospital.getEmail())
                .password(hospital.getPassword())
                .roles("HOSPITAL")
                .build();
    }
}