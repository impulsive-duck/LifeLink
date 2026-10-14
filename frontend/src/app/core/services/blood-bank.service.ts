import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BloodBankService {

  private apiUrl = `${environment.apiUrl}/bloodbanks`;

  constructor(private http: HttpClient) {}

  registerBloodBank(data: any) {
    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      data
    );
  }
}