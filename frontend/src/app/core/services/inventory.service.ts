import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = `${environment.apiUrl}/bloodbank/inventory`;

  constructor(
    private http: HttpClient
  ) {}

  getInventory() {

    const token =
      localStorage.getItem('token');

    return this.http.get<any[]>(
      `${this.apiUrl}/bloodbank`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  addInventory(data: any) {

    const token =
      localStorage.getItem('token');

    return this.http.post(
      this.apiUrl,
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  updateStock(id: number, unitsAvailable: number) {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${environment.apiUrl}/bloodbank/inventory/${id}?unitsAvailable=${unitsAvailable}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  deleteStock(id: number) {
    const token = localStorage.getItem('token');
    return this.http.delete(
      `${environment.apiUrl}/bloodbank/inventory/${id}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  approveRequest(id: number) {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${environment.apiUrl}/requests/${id}/approve`,
      {},
      {
        responseType: 'text',
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  rejectRequest(id: number) {
  const token = localStorage.getItem('token');
  return this.http.put(
    `${environment.apiUrl}/requests/${id}/reject`,
    {},
    {
      responseType: 'text',
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }
  );
}

  getPendingRequests() {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(
      `${environment.apiUrl}/requests/bloodbank`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  getAllRequests() {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(
      `${environment.apiUrl}/requests/bloodbank/all`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  getBloodBankDonationRequests() {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(
      `${environment.apiUrl}/donor/donation-requests/bloodbank`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  notifyDonors(id: number) {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${environment.apiUrl}/requests/${id}/notify-donors`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'text'
      }
    );
  }

  getPendingCertificates() {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(
      `${environment.apiUrl}/bloodbank/certificates/pending`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  verifyCertificate(certificateId: number) {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${environment.apiUrl}/bloodbank/certificates/${certificateId}/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  rejectCertificate(certificateId: number) {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${environment.apiUrl}/bloodbank/certificates/${certificateId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}