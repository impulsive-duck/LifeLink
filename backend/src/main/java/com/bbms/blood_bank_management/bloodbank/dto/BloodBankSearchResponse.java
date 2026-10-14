package com.bbms.blood_bank_management.bloodbank.dto;

public class BloodBankSearchResponse {

    private Long bloodBankId;
    private String bloodBankName;
    private Integer availableUnits;
    private Double distanceKm;
    private String address;
    private String city;
    private String state;
    private String contactNumber;
    private String email;
    private Double latitude;
    private Double longitude;

    public BloodBankSearchResponse() {}

    public BloodBankSearchResponse(
            Long bloodBankId,
            String bloodBankName,
            Integer availableUnits,
            Double distanceKm) {

        this.bloodBankId = bloodBankId;
        this.bloodBankName = bloodBankName;
        this.availableUnits = availableUnits;
        this.distanceKm = distanceKm;
    }

    public BloodBankSearchResponse(
            Long bloodBankId,
            String bloodBankName,
            Integer availableUnits,
            Double distanceKm,
            String address,
            String city,
            String state,
            String contactNumber,
            String email,
            Double latitude,
            Double longitude) {

        this.bloodBankId = bloodBankId;
        this.bloodBankName = bloodBankName;
        this.availableUnits = availableUnits;
        this.distanceKm = distanceKm;
        this.address = address;
        this.city = city;
        this.state = state;
        this.contactNumber = contactNumber;
        this.email = email;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getBloodBankId() {
        return bloodBankId;
    }

    public void setBloodBankId(Long bloodBankId) {
        this.bloodBankId = bloodBankId;
    }

    public String getBloodBankName() {
        return bloodBankName;
    }

    public void setBloodBankName(String bloodBankName) {
        this.bloodBankName = bloodBankName;
    }

    public Integer getAvailableUnits() {
        return availableUnits;
    }

    public void setAvailableUnits(Integer availableUnits) {
        this.availableUnits = availableUnits;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}