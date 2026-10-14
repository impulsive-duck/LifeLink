import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HospitalAuthService } from '../../../core/services/hospital-auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-hospital-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AppFooterComponent],
  template: `
    <div class="lifelink-auth-wrapper">
      <!-- Universal Auth Header -->
      <header class="lifelink-auth-nav">
        <a routerLink="/" class="lifelink-brand-logo">
          <div class="brand-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <span>LifeLink</span>
        </a>
        <div class="nav-right-tag">
          <span class="badge badge-info">Healthcare Facility Console</span>
        </div>
      </header>

      <!-- Center Auth Main -->
      <main class="lifelink-auth-content">
        <div class="lifelink-auth-container">
          <div class="lifelink-auth-card">
            
            <div class="lifelink-auth-header">
              <span class="lifelink-portal-badge badge-hospital">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 12h6"></path>
                  <path d="M12 9v6"></path>
                </svg>
                Hospital Portal
              </span>
              <h1 class="lifelink-auth-title">Hospital Portal Sign In</h1>
              <p class="lifelink-auth-subtitle">Access your hospital's blood inventory and emergency dispatch console.</p>
            </div>

            <!-- Registration Success Alert Banner (when redirected from registration) -->
            <div class="lifelink-alert-banner alert-success" *ngIf="registeredEmail">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div class="alert-body">
                <div class="alert-title">Registration Successful</div>
                <div>Registration successful! Your hospital account <strong>{{ registeredEmail }}</strong> has been created and is pending verification.</div>
              </div>
              <button type="button" class="alert-btn-close" (click)="registeredEmail = null" title="Dismiss notification">&times;</button>
            </div>

            <!-- Verification Pending Alert (when login attempt is blocked) -->
            <div class="lifelink-alert-banner alert-warning" *ngIf="pendingVerificationNotice">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              </svg>
              <div class="alert-body">
                <div class="alert-title">Accreditation Pending Approval</div>
                <div>This hospital account is registered but awaiting review. An authorized Health Authority Verifier must approve your medical license before login is permitted.</div>
              </div>
            </div>

            <!-- Login Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="lifelink-form">
              <div class="lifelink-form-group">
                <label for="username" class="lifelink-label">Registrant Email or Mobile Number</label>
                <div class="lifelink-input-wrap">
                  <svg class="lifelink-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <input 
                    id="username" 
                    type="text" 
                    formControlName="username" 
                    class="lifelink-input with-icon" 
                    placeholder="e.g. dr.rajesh@apexhospital.org"
                    [class.is-invalid]="f['username'].touched && f['username'].invalid"
                  />
                </div>
                <div class="lifelink-error-msg" *ngIf="f['username'].touched && f['username'].invalid">
                  Email or phone number is required
                </div>
              </div>

              <div class="lifelink-form-group">
                <div class="label-row">
                  <label for="password" class="lifelink-label">Account Password</label>
                </div>
                <div class="lifelink-input-wrap">
                  <svg class="lifelink-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input 
                    id="password" 
                    [type]="showPassword ? 'text' : 'password'" 
                    formControlName="password" 
                    class="lifelink-input with-icon" 
                    placeholder="Enter password"
                    [class.is-invalid]="f['password'].touched && f['password'].invalid"
                  />
                  <button type="button" class="lifelink-password-toggle" (click)="showPassword = !showPassword" aria-label="Toggle password visibility">
                    <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="3" r="3"></circle>
                    </svg>
                    <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  </button>
                </div>
                <div class="lifelink-error-msg" *ngIf="f['password'].touched && f['password'].invalid">
                  Password is required
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="isLoading">
                <span *ngIf="!isLoading">Sign In to Hospital Console</span>
                <span *ngIf="isLoading">Authenticating Facility...</span>
              </button>
            </form>

            <div class="lifelink-auth-footer">
              <p>Don't have a registered hospital account?</p>
              <a routerLink="/hospital/register" class="lifelink-link-accent">Register Healthcare Facility &rarr;</a>
            </div>

            <div class="lifelink-portal-switcher">
              <span class="switcher-label">Other Stakeholder Portals:</span>
              <div class="switcher-links">
                <a routerLink="/donor/login" class="switcher-link">
                  <span class="dot-donor"></span>
                  Donor Portal
                </a>
                <span class="divider">|</span>
                <a routerLink="/blood-bank/login" class="switcher-link">
                  <span class="dot-bb"></span>
                  Blood Bank Portal
                </a>
                <span class="divider">|</span>
                <a routerLink="/admin/login" class="switcher-link">
                  <span class="dot-admin"></span>
                  Health Authority
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class HospitalLoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(HospitalAuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = false;
  isLoading = false;
  pendingVerificationNotice = false;
  registeredEmail: string | null = null;

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const emailFromQuery = this.route.snapshot.queryParams['email'];
    const isSubmitted = this.route.snapshot.queryParams['registered'];

    // Clear any prior hospital session so the login page starts in clean state
    this.authService.logout(false);

    if (emailFromQuery) {
      this.registeredEmail = emailFromQuery;
      this.loginForm.patchValue({ username: emailFromQuery });
      if (isSubmitted === 'true') {
        this.toastService.info(
          `Your registration for "${emailFromQuery}" is waiting for Health Authority approval.`,
          'Verification Required'
        );
      }
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.warning('Please enter your registered email/phone and password.', 'Required Fields');
      return;
    }

    this.isLoading = true;
    this.pendingVerificationNotice = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Authenticated to Hospital Blood Management Console.', 'Welcome Back');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/hospital/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: any) => {
        this.isLoading = false;
        const msg = err.error?.message || err.error || '';
        const msgStr = typeof msg === 'string' ? msg : '';

        if (msgStr.toLowerCase().includes('verification pending') || msgStr.toLowerCase().includes('not allowed')) {
          this.pendingVerificationNotice = true;
          this.toastService.warning(
            'Accreditation Pending: Your medical license is awaiting review by a Health Authority Officer.',
            'Verification Required'
          );
        } else if (msgStr.toLowerCase().includes('not found')) {
          this.toastService.error(
            'No hospital facility found with this username/email. Please verify your credentials or register.',
            'Account Not Found'
          );
        } else if (msgStr.toLowerCase().includes('password')) {
          this.toastService.error(
            'Incorrect password entered. Please verify and try again.',
            'Invalid Password'
          );
        } else {
          this.toastService.error(
            msgStr || 'Invalid login credentials. Please check your username and password.',
            'Login Failed'
          );
        }
      }
    });
  }
}
