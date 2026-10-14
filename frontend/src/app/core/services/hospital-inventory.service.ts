import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  BloodInventory,
  UpdateInventoryRequest,
} from "../models/hospital-inventory.model";

@Injectable({
  providedIn: "root",
})
export class HospitalInventoryService {
  private readonly baseUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getMyInventory() {
    return this.http.get<BloodInventory[]>(this.baseUrl);
  }

  updateInventory(request: UpdateInventoryRequest) {
    return this.http.put<BloodInventory>(this.baseUrl, request);
  }
}
