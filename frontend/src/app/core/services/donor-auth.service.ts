import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonorAuthService {
  private apiUrl = `${environment.apiUrl}/donor`;

  constructor(private http: HttpClient) {}

  registerDonor(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  loginDonor(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}
