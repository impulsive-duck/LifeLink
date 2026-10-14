package com.bbms.blood_bank_management.admin.dto;

public class AdminLoginResponse {

    private String token;
    private String username;
    private String role;

    public AdminLoginResponse(
            String token,
            String username,
            String role) {

        this.token = token;
        this.username = username;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }
}