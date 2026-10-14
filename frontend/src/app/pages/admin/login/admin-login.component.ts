import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule, ActivatedRoute } from "@angular/router";
import { HospitalAuthService } from "../../../core/services/hospital-auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { HospitalNavbarComponent } from "../../../shared/components/hospital-navbar/hospital-navbar.component";
import { AppFooterComponent } from "../../../shared/components/app-footer/app-footer.component";

@Component({
  selector: "app-admin-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HospitalNavbarComponent, AppFooterComponent],
  template: `
    <app-hospital-navbar></app-hospital-navbar>
    <div class="admin-auth-wrapper">
      <div class="admin-auth-card">
        <!-- Badge & Header -->
        <div class="auth-header">
          <div class="authority-badge-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <span class="sub-agency-tag"
            >Ministry of Health & Family Welfare</span
          >
          <h1 class="auth-title">Health Authority Verifier Portal</h1>
          <p class="auth-subtitle">
            Restricted to authorized verification officers & medical regulatory
            administrators
          </p>
        </div>

        <!-- Quick Demo Fill Banner -->
        <div class="demo-credentials-banner">
          <div class="banner-text">
            <strong>Default Verifier Credentials:</strong>
            <code>admin</code> /
            <code>Admin&#64;123</code>
          </div>
          <button
            type="button"
            class="btn btn-xs btn-outline-admin"
            (click)="fillAdminCredentials()"
          >
            Auto-fill
          </button>
        </div>

        <!-- Admin Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="admin-user" class="form-label"
              >Authority Officer Username</label
            >
            <div class="input-icon-wrap">
              <svg
                class="input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input
                id="admin-user"
                type="text"
                formControlName="username"
                class="form-control"
                placeholder="admin"
                [class.is-invalid]="
                  f['username'].touched && f['username'].invalid
                "
              />
            </div>
            <div
              class="form-error"
              *ngIf="f['username'].touched && f['username'].invalid"
            >
              <span>Admin username is required</span>
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="admin-pass" class="form-label"
                >Security Key / Password</label
              >
            </div>
            <div class="input-icon-wrap">
              <svg
                class="input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="admin-pass"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                class="form-control"
                placeholder="Enter administrator password"
                [class.is-invalid]="
                  f['password'].touched && f['password'].invalid
                "
              />
              <button
                type="button"
                class="btn-toggle-password"
                (click)="showPassword = !showPassword"
                aria-label="Toggle password visibility"
              >
                <svg
                  *ngIf="!showPassword"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  *ngIf="showPassword"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  ></path>
                  <path
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                  ></path>
                  <line x1="2" y1="2" x2="22" y2="22"></line>
                </svg>
              </button>
            </div>
            <div
              class="form-error"
              *ngIf="f['password'].touched && f['password'].invalid"
            >
              <span>Password is required</span>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-admin btn-block btn-lg"
            [disabled]="isLoading"
          >
            <span *ngIf="!isLoading">Authenticate Officer Session</span>
            <span *ngIf="isLoading">Verifying Credentials...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Are you a hospital representative?</p>
          <a routerLink="/hospital/login" class="link-hospital"
            >Go to Hospital Portal Login &rarr;</a
          >
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
      }
      .admin-auth-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem 1.5rem;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      }
      .admin-auth-card {
        width: 100%;
        max-width: 480px;
        background: #ffffff;
        border-radius: 18px;
        padding: 2.5rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
        border: 1px solid #334155;
      }
      .auth-header {
        text-align: center;
        margin-bottom: 1.75rem;
      }
      .authority-badge-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
        color: #ffffff;
        border-radius: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        box-shadow: 0 8px 20px rgba(15, 118, 110, 0.3);
      }
      .sub-agency-tag {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #0f766e;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.25rem;
      }
      .auth-title {
        font-size: 1.45rem;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.02em;
        margin-bottom: 0.35rem;
      }
      .auth-subtitle {
        font-size: 0.8125rem;
        color: #64748b;
        line-height: 1.4;
      }
      .demo-credentials-banner {
        background: #f0fdfa;
        border: 1px solid #ccfbf1;
        border-radius: 10px;
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        gap: 0.75rem;
      }
      .banner-text {
        font-size: 0.75rem;
        color: #115e59;
      }
      .banner-text strong {
        display: block;
        margin-bottom: 0.15rem;
      }
      .banner-text code {
        background: #e6fffa;
        padding: 0.1rem 0.3rem;
        border-radius: 4px;
        font-size: 0.75rem;
        color: #0f766e;
        font-weight: 700;
      }
      .btn-xs {
        padding: 0.3rem 0.7rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.15s;
      }
      .btn-outline-admin {
        background: #ffffff;
        border: 1px solid #0f766e;
        color: #0f766e;
      }
      .btn-outline-admin:hover {
        background: #0f766e;
        color: #ffffff;
      }
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .form-label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #334155;
      }
      .input-icon-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }
      .input-icon {
        position: absolute;
        left: 0.875rem;
        color: #94a3b8;
        pointer-events: none;
      }
      .form-control {
        width: 100%;
        padding: 0.65rem 0.875rem 0.65rem 2.5rem;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 0.875rem;
        outline: none;
        transition: all 0.15s;
      }
      .form-control:focus {
        border-color: #0f766e;
        box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
      }
      .form-control.is-invalid {
        border-color: #ef4444;
        background: #fffafa;
      }
      .form-error {
        font-size: 0.75rem;
        color: #ef4444;
        font-weight: 500;
      }
      .btn-toggle-password {
        position: absolute;
        right: 0.875rem;
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0;
      }
      .btn-admin {
        background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
        color: #ffffff;
        border: none;
        padding: 0.875rem;
        font-weight: 700;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(15, 118, 110, 0.35);
        cursor: pointer;
        width: 100%;
        transition: all 0.15s;
      }
      .btn-admin:hover:not(:disabled) {
        background: #115e59;
        transform: translateY(-1px);
      }
      .btn-admin:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .auth-footer {
        margin-top: 2rem;
        padding-top: 1.25rem;
        border-top: 1px solid #f1f5f9;
        text-align: center;
        font-size: 0.875rem;
        color: #64748b;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .link-hospital {
        color: #0f766e;
        font-weight: 700;
        text-decoration: none;
      }
      .link-hospital:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(HospitalAuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = false;
  isLoading = false;

  loginForm: FormGroup = this.fb.group({
    username: ["admin", Validators.required],
    password: ["Admin@123", Validators.required],
  });

  get f() {
    return this.loginForm.controls;
  }

  fillAdminCredentials(): void {
    this.loginForm.patchValue({
      username: "admin",
      password: "Admin@123",
    });

    this.toastService.info(
      "Loaded default verifier credentials (admin / Admin@123).",
      "Admin Key Ready",
    );
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.warning(
        "Please enter both administrator username and security key.",
        "Required Fields",
      );
      return;
    }

    this.isLoading = true;
    this.authService.adminLogin(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success(
          "Authenticated as Health Authority Verifier.",
          "Officer Session Active",
        );
        const returnUrl =
          this.route.snapshot.queryParams["returnUrl"] || "/admin/verify";
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: any) => {
        this.isLoading = false;
        const msg =
          err.error?.message ||
          err.error ||
          "Invalid administrator credentials. Access restricted to authorized officers.";
        this.toastService.error(
          typeof msg === "string" ? msg : "Admin Login Failed",
          "Authentication Error",
        );
      },
    });
  }
}
