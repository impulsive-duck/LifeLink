import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, map } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import {
  ApiResponse,
  AuthResponse,
  CertificateResponse,
  Hospital,
  LoginRequest,
  SignupRequest,
} from "../models/hospital-auth.model";

@Injectable({
  providedIn: "root",
})
export class HospitalAuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = "hospital_auth_token";
  private readonly USER_KEY = "hospital_auth_user";
  private readonly ROLE_KEY = "hospital_auth_role";
  private readonly NAME_KEY = "hospital_auth_name";
  private readonly adminUrl = `${environment.apiUrl}/admin`;

  currentUser = signal<string | null>(null);
  userRole = signal<string | null>(null);
  displayName = signal<string | null>(null);
  isAuthenticated = signal<boolean>(false);

  isAdmin = computed(() => this.userRole() === "ROLE_ADMIN");
  isHospital = computed(() => this.userRole() === "ROLE_HOSPITAL");

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      if (!payload) {
        this.logout(false);
        return;
      }

      const username =
        localStorage.getItem(this.USER_KEY) ||
        this.extractUsernameFromToken(token);
      const role =
        localStorage.getItem(this.ROLE_KEY) || this.extractRoleFromToken(token);
      const name = localStorage.getItem(this.NAME_KEY);

      if (username && role) {
        this.currentUser.set(username);
        this.userRole.set(role);
        this.displayName.set(name || username);
        this.isAuthenticated.set(true);
      } else {
        this.logout(false);
      }
    } else {
      this.logout(false);
    }
  }

  signup(request: SignupRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, request).pipe(
      map(res => {
        if (res && res.message && !res.token) {
          throw new Error(res.message);
        }
        return res;
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${this.baseUrl}/login`, request).pipe(
      map(res => {
        if (res && res.message && !res.token) {
          throw new Error(res.message);
        }
        return res as AuthResponse;
      }),
      tap((res) => {
        if (res && res.token) {
          const role =
            res.role || this.extractRoleFromToken(res.token) || "ROLE_HOSPITAL";
          const username =
            res.username ||
            this.extractUsernameFromToken(res.token) ||
            request.username;
          const dispName = res.displayName || username;

          this.handleAuthSuccess(res.token, username, role, dispName);
        }
      })
    );
  }

  adminLogin(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<any>(`${environment.apiUrl}/admin/login`, request)
      .pipe(
        map(res => {
          if (res && res.message && !res.token) {
            throw new Error(res.message);
          }
          return res as AuthResponse;
        }),
        tap((res) => {
          if (res && res.token) {
            const role = res.role || "ROLE_ADMIN";
            const username = res.username || request.username;
            const dispName = res.displayName || "Health Authority Admin";

            this.handleAuthSuccess(res.token, username, role, dispName);
          }
        })
      );
  }

  private handleAuthSuccess(
    token: string,
    username: string,
    role: string,
    displayName: string,
  ): void {
    this.setToken(token);
    localStorage.setItem(this.USER_KEY, username);
    localStorage.setItem(this.ROLE_KEY, role);
    localStorage.setItem(this.NAME_KEY, displayName);

    this.currentUser.set(username);
    this.userRole.set(role);
    this.displayName.set(displayName);
    this.isAuthenticated.set(true);
  }

  getPendingHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(`${this.adminUrl}/pending-hospitals`);
  }

  getVerifiedHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(`${this.adminUrl}/verified-hospitals`);
  }

  getCertificate(hospitalId: number): Observable<CertificateResponse> {
    return this.http.get<CertificateResponse>(
      `${this.baseUrl}/get-certificate/${hospitalId}`,
    );
  }

  verifyHospital(hospitalId: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.adminUrl}/verify/${hospitalId}`,
      {},
    );
  }

  rejectHospital(hospitalId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.adminUrl}/reject/${hospitalId}`,
    );
  }

  getCurrentProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout(navigate: boolean = true): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.NAME_KEY);

    this.currentUser.set(null);
    this.userRole.set(null);
    this.displayName.set(null);
    this.isAuthenticated.set(false);

    if (navigate) {
      this.router.navigate(["/hospital/login"]);
    }
  }

  private extractUsernameFromToken(token: string): string | null {
    try {
      const payload = this.decodeToken(token);
      return payload?.sub || payload?.username || null;
    } catch {
      return null;
    }
  }

  private extractRoleFromToken(token: string): string | null {
    try {
      const payload = this.decodeToken(token);
      return payload?.role || null;
    } catch {
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return null;
      const decodedJson = atob(payloadBase64);
      const payload = JSON.parse(decodedJson);
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }
}
