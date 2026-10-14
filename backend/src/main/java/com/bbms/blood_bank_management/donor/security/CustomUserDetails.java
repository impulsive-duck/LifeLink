package com.bbms.blood_bank_management.donor.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.bbms.blood_bank_management.donor.entity.Donor;

public class CustomUserDetails implements UserDetails {

    private final Donor donor;

    public CustomUserDetails(Donor donor) {
        this.donor = donor;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_DONOR")
        );
    }

    @Override
    public String getPassword() {
        return donor.getPassword();
    }

    @Override
    public String getUsername() {
        return donor.getUsername();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }


    public Donor getDonor() {
        return donor;
    }
}