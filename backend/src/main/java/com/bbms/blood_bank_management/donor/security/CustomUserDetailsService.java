package com.bbms.blood_bank_management.donor.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bbms.blood_bank_management.donor.entity.Donor;
import com.bbms.blood_bank_management.donor.repository.DonorRepository;

@Service("donorUserDetailsService")
public class CustomUserDetailsService
        implements UserDetailsService {

    private final DonorRepository donorRepository;

    public CustomUserDetailsService(
            DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        if (username == null || username.trim().isEmpty()) {
            throw new UsernameNotFoundException("Donor username required");
        }

        String u = username.trim();

        Donor donor = donorRepository
                .findByUsernameIgnoreCase(u)
                .or(() -> donorRepository.findByEmailIgnoreCase(u))
                .or(() -> donorRepository.findByMobileNumber(u))
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Donor not found with identifier: " + username));

        return new CustomUserDetails(donor);
    }
}