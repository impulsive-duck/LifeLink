import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { BloodRequest, BloodRequestDto } from "../models/hospital-request.model";
import { BloodBankSearchResult } from "../models/hospital-search.model";

@Injectable({
  providedIn: "root",
})
export class HospitalBloodRequestService {
  private readonly baseUrl = `${environment.apiUrl}/requests`;
  private readonly bloodBankUrl = `${environment.apiUrl}/bloodbanks`;

  constructor(private http: HttpClient) {}

  raiseRequest(request: BloodRequestDto): Observable<BloodRequest> {
    return this.http.post<BloodRequest>(this.baseUrl, request);
  }

  getUnreadRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.baseUrl}/unread`);
  }

  getMyHospitalRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.baseUrl}/my-hospital`);
  }

  markAsRead(requestId: number): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/mark-as-read/${requestId}`,
      {},
      { responseType: "text" },
    );
  }

  searchBloodBanks(
    bloodGroup: string,
    unitsRequired: number,
    latitude: number,
    longitude: number,
  ): Observable<BloodBankSearchResult[]> {
    return this.http.get<BloodBankSearchResult[]>(
      `${this.bloodBankUrl}/search`,
      {
        params: {
          bloodGroup,
          unitsRequired: unitsRequired.toString(),
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      },
    );
  }

  searchNearestBloodBanks(
    latitude: number,
    longitude: number,
  ): Observable<BloodBankSearchResult[]> {
    return this.http.get<BloodBankSearchResult[]>(
      `${this.bloodBankUrl}/search-nearest`,
      {
        params: {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      },
    );
  }

  getAllBloodBanks(): Observable<any[]> {
    return this.http.get<any[]>(this.bloodBankUrl);
  }

  getBloodBankById(id: number): Observable<any> {
    return this.http.get<any>(`${this.bloodBankUrl}/${id}`);
  }

  getHospitalDonationRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/donor/donation-requests/hospital`);
  }
}
