import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { DonorProfile } from '../models/donor-profile.model';
import { DonorProfileUpdateRequest } from '../models/donor-profile-update.model';
import { DonorEligibility } from '../models/eligibility.model';
import { DonationRequest } from '../models/donor-request.model';
import { DonationRequestActionResponse } from '../models/donor-request-status.model';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  private readonly apiUrl = `${environment.apiUrl}/donor`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<DonorProfile> {
    return this.http.get<DonorProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(payload: DonorProfileUpdateRequest): Observable<DonorProfile> {
    return this.http.patch<DonorProfile>(`${this.apiUrl}/profile`, payload);
  }

  checkEligibility(): Observable<DonorEligibility> {
    return this.http.get<DonorEligibility>(`${this.apiUrl}/eligibility`);
  }

  getDonationRequests(): Observable<DonationRequest[]> {
    return this.http.get<DonationRequest[]>(`${this.apiUrl}/donation-requests`);
  }

  getPendingDonationRequests() {
    return this.http.get<DonationRequest[]>(
      `${this.apiUrl}/donation-requests/pending`,
    );
  }
  getDonationRequestById(requestId: number): Observable<DonationRequest> {
    return this.http.get<DonationRequest>(
      `${this.apiUrl}/donation-requests/${requestId}`,
    );
  }

  acceptRequest(requestId: number): Observable<DonationRequestActionResponse> {
    return this.http.patch<DonationRequestActionResponse>(
      `${this.apiUrl}/donation-requests/${requestId}/accept`,
      {},
    );
  }
  uploadCertificate(requestId: number, payload: any) {
    return this.http.post(
      `${this.apiUrl}/donation-requests/${requestId}/certificate` +
        `?certificateUrl=${encodeURIComponent(payload.certificateUrl)}` +
        `&certificateNumber=${payload.certificateNumber}` +
        `&issuingOrganizationName=${payload.issuingOrganizationName}` +
        `&issuingOrganizationId=${payload.issuingOrganizationId}` +
        `&donationDate=${payload.donationDate}` +
        `&bloodComponent=${payload.bloodComponent}` +
        `&units=${payload.units}`,
      {},
    );
  }
  rejectRequest(requestId: number): Observable<DonationRequestActionResponse> {
    return this.http.patch<DonationRequestActionResponse>(
      `${this.apiUrl}/donation-requests/${requestId}/reject`,
      {},
    );
  }

  requestVerification(certificateId: number) {
    return this.http.post(
      `${this.apiUrl}/certificates/${certificateId}/request-verification`,
      {},
    );
  }

  getCertificates() {
    return this.http.get<any[]>(`${this.apiUrl}/certificates`);
  }

  getCertificateFile(certificateId: number) {
    return this.http.get(`${this.apiUrl}/certificates/${certificateId}/file`);
  }
}
