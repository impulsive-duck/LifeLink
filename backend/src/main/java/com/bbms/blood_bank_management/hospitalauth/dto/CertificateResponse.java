package com.bbms.blood_bank_management.hospitalauth.dto;

public class CertificateResponse {

    private String certificateLink;

    public CertificateResponse(String certificateLink) {
        this.certificateLink = certificateLink;
    }

    public String getCertificateLink() {
        return certificateLink;
    }
}