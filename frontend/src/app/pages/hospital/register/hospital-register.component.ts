import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HospitalAuthService } from '../../../core/services/hospital-auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { HospitalNavbarComponent } from '../../../shared/components/hospital-navbar/hospital-navbar.component';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';
import { noDigitsValidator } from '../../../core/validators/custom-validators';

@Component({
  selector: 'app-hospital-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HospitalNavbarComponent, AppFooterComponent],
  template: `
    <div class="page-layout">
      <app-hospital-navbar></app-hospital-navbar>
      <main class="register-wrapper">
        <div class="register-container">
        <!-- Header -->
        <div class="register-header">
          <div class="header-content">
            <div class="badge-role">Healthcare Facility Onboarding</div>
            <h1 class="page-title">Hospital & Blood Center Registration</h1>
            <p class="page-subtitle">Join the centralized regional healthcare emergency and blood synchronization network.</p>
          </div>
          <button type="button" class="btn btn-outline autofill-btn" (click)="fillDemoData()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span>Auto-fill Test Hospital</span>
          </button>
        </div>

        <!-- Registration Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form" novalidate>
          <!-- Card 1: Hospital Details -->
          <div class="form-section-card">
            <div class="section-badge">
              <span class="step-num">1</span>
              <div>
                <h2 class="section-title">Hospital Profile & Verification Details</h2>
                <p class="section-desc">Official medical facility identity and registry information</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group col-span-2">
                <label class="form-label">Hospital / Institution Name <span class="req">*</span></label>
                <input 
                  type="text" 
                  formControlName="hospitalName" 
                  class="form-control" 
                  placeholder="e.g. Apex Memorial Super Specialty Hospital" 
                  [class.is-invalid]="f['hospitalName'].touched && f['hospitalName'].invalid" 
                />
                <div class="form-error" *ngIf="f['hospitalName'].touched && f['hospitalName'].errors?.['required']">
                  Hospital name is required
                </div>
                <div class="form-error" *ngIf="f['hospitalName'].touched && f['hospitalName'].errors?.['hasDigits']">
                  Hospital name must not contain digits
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Hospital Type <span class="req">*</span></label>
                <select formControlName="type" class="form-control" [class.is-invalid]="f['type'].touched && f['type'].invalid">
                  <option value="" disabled>Select hospital type</option>
                  <option value="Multi-Specialty Hospital">Multi-Specialty Hospital</option>
                  <option value="Government / District Hospital">Government / District Hospital</option>
                  <option value="Private Blood Bank">Private Blood Bank & Research</option>
                  <option value="Trauma & Emergency Care">Trauma & Emergency Care Center</option>
                  <option value="General Hospital">General Hospital</option>
                </select>
                <div class="form-error" *ngIf="f['type'].touched && f['type'].invalid">
                  Hospital type is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Medical License Number <span class="req">*</span></label>
                <input 
                  type="text" 
                  formControlName="licenseNumber" 
                  class="form-control" 
                  placeholder="e.g. MED-LIC-2024-9842" 
                  [class.is-invalid]="f['licenseNumber'].touched && f['licenseNumber'].invalid" 
                />
                <div class="form-error" *ngIf="f['licenseNumber'].touched && f['licenseNumber'].invalid">
                  License number is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">ABDM HFR ID <span class="req">*</span></label>
                <input 
                  type="text" 
                  formControlName="abdmHfrId" 
                  class="form-control" 
                  placeholder="e.g. IN-MH-HFR-1049" 
                  [class.is-invalid]="f['abdmHfrId'].touched && f['abdmHfrId'].invalid" 
                />
                <div class="form-error" *ngIf="f['abdmHfrId'].touched && f['abdmHfrId'].invalid">
                  ABDM HFR ID is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">License Certificate Link / Document URL <span class="req">*</span></label>
                <input 
                  type="url" 
                  formControlName="licenseCertificateLink" 
                  class="form-control" 
                  placeholder="https://drive.google.com/cert/apex-hosp.pdf" 
                  [class.is-invalid]="f['licenseCertificateLink'].touched && f['licenseCertificateLink'].invalid" 
                />
                <div class="form-error" *ngIf="f['licenseCertificateLink'].touched && f['licenseCertificateLink'].errors?.['required']">
                  License certificate link is required
                </div>
                <div class="form-error" *ngIf="f['licenseCertificateLink'].touched && f['licenseCertificateLink'].errors?.['invalidDocLink']">
                  Document link must contain a valid format (.com or .pdf)
                </div>
              </div>

              <div class="form-group col-span-2">
                <label class="form-label">Hospital Physical Address <span class="req">*</span></label>
                <textarea 
                  formControlName="address" 
                  rows="2" 
                  class="form-control" 
                  placeholder="Complete hospital street address, landmark, city, postal code" 
                  [class.is-invalid]="f['address'].touched && f['address'].invalid"
                ></textarea>
                <div class="form-error" *ngIf="f['address'].touched && f['address'].invalid">
                  Hospital address is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Latitude <span class="req">*</span></label>
                <input 
                  type="number" 
                  step="0.0001" 
                  formControlName="latitude" 
                  class="form-control" 
                  placeholder="e.g. 19.0760" 
                  [class.is-invalid]="f['latitude'].touched && f['latitude'].invalid" 
                />
                <div class="form-error" *ngIf="f['latitude'].touched && f['latitude'].invalid">
                  Valid latitude is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Longitude <span class="req">*</span></label>
                <input 
                  type="number" 
                  step="0.0001" 
                  formControlName="longitude" 
                  class="form-control" 
                  placeholder="e.g. 72.8777" 
                  [class.is-invalid]="f['longitude'].touched && f['longitude'].invalid" 
                />
                <div class="form-error" *ngIf="f['longitude'].touched && f['longitude'].invalid">
                  Valid longitude is required
                </div>
              </div>

              <!-- Manual Coordinate Instructions Help Card -->
              <div class="col-span-2">
                <div class="coord-guide-box">
                  <div class="coord-guide-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <strong>How to find your Latitude & Longitude on Google Maps</strong>
                  </div>
                  <div class="coord-guide-content">
                    <p class="guide-intro">Find the exact location of your hospital on Google Maps:</p>
                    <ol>
                      <li>Open Google Maps (<strong>maps.google.com</strong>) on your computer or phone.</li>
                      <li>Search or right-click on your hospital's exact facility location on the map.</li>
                      <li>Select the coordinates displayed at the top of the context menu (for example: <code>19.0760, 72.8777</code>).</li>
                      <li>Paste the first number as <strong>Latitude</strong> and the second number as <strong>Longitude</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Official Hospital Email <span class="req">*</span></label>
                <input 
                  type="email" 
                  formControlName="officialHospitalEmail" 
                  class="form-control" 
                  placeholder="contact@apexhospital.org" 
                  [class.is-invalid]="f['officialHospitalEmail'].touched && f['officialHospitalEmail'].invalid" 
                />
                <div class="form-error" *ngIf="f['officialHospitalEmail'].touched && f['officialHospitalEmail'].invalid">
                  Must be a valid email address (.com, .org, .in)
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Hospital Emergency Contact Phone <span class="req">*</span></label>
                <input 
                  type="tel" 
                  maxlength="10" 
                  formControlName="hospitalContactNumber" 
                  class="form-control" 
                  placeholder="10-digit number" 
                  [class.is-invalid]="f['hospitalContactNumber'].touched && f['hospitalContactNumber'].invalid" 
                />
                <div class="form-error" *ngIf="f['hospitalContactNumber'].touched && f['hospitalContactNumber'].invalid">
                  Must be a valid 10-digit mobile number starting with 6-9
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Authorized Registrant -->
          <div class="form-section-card">
            <div class="section-badge">
              <span class="step-num">2</span>
              <div>
                <h2 class="section-title">Authorized Medical Officer / Registrant</h2>
                <p class="section-desc">Medical officer or administrative staff managing this portal</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Registrant Full Name <span class="req">*</span></label>
                <input 
                  type="text" 
                  formControlName="registrantName" 
                  class="form-control" 
                  placeholder="Dr. Rajesh Sharma" 
                  [class.is-invalid]="f['registrantName'].touched && f['registrantName'].invalid" 
                />
                <div class="form-error" *ngIf="f['registrantName'].touched && f['registrantName'].invalid">
                  Registrant full name is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Designation / Role <span class="req">*</span></label>
                <input 
                  type="text" 
                  formControlName="designation" 
                  class="form-control" 
                  placeholder="Chief Medical Officer / Blood Bank Head" 
                  [class.is-invalid]="f['designation'].touched && f['designation'].invalid" 
                />
                <div class="form-error" *ngIf="f['designation'].touched && f['designation'].invalid">
                  Designation is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Staff / Employee ID <span class="req">*</span></label>
                <input 
                  type="text" 
                  formControlName="employeeId" 
                  class="form-control" 
                  placeholder="EMP-90214" 
                  [class.is-invalid]="f['employeeId'].touched && f['employeeId'].invalid" 
                />
                <div class="form-error" *ngIf="f['employeeId'].touched && f['employeeId'].invalid">
                  Employee ID is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Registrant Mobile Phone <span class="req">*</span></label>
                <input 
                  type="tel" 
                  maxlength="10" 
                  formControlName="phoneNumber" 
                  class="form-control" 
                  placeholder="10-digit number" 
                  [class.is-invalid]="f['phoneNumber'].touched && f['phoneNumber'].invalid" 
                />
                <div class="form-error" *ngIf="f['phoneNumber'].touched && f['phoneNumber'].invalid">
                  Must be a valid 10-digit mobile number starting with 6-9
                </div>
              </div>

              <div class="form-group col-span-2">
                <label class="form-label">Registrant Account Email (Used for Login) <span class="req">*</span></label>
                <input 
                  type="email" 
                  formControlName="email" 
                  class="form-control" 
                  placeholder="dr.rajesh@apexhospital.org" 
                  [class.is-invalid]="f['email'].touched && f['email'].invalid" 
                />
                <div class="form-error" *ngIf="f['email'].touched && f['email'].invalid">
                  Must be a valid email (.com, .org, .in)
                </div>
              </div>
            </div>
          </div>

          <!-- Card 3: Security Credentials -->
          <div class="form-section-card">
            <div class="section-badge">
              <span class="step-num">3</span>
              <div>
                <h2 class="section-title">Security & Account Password</h2>
                <p class="section-desc">Create a secure password for authenticating to this portal</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Password <span class="req">*</span></label>
                <input 
                  type="password" 
                  formControlName="password" 
                  class="form-control" 
                  placeholder="Minimum 8 characters" 
                  [class.is-invalid]="f['password'].touched && f['password'].invalid" 
                />
                <div class="form-error" *ngIf="f['password'].touched && f['password'].invalid">
                  Password must be at least 8 characters long
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Confirm Password <span class="req">*</span></label>
                <input 
                  type="password" 
                  formControlName="confirmPassword" 
                  class="form-control" 
                  placeholder="Re-enter password" 
                  [class.is-invalid]="f['confirmPassword'].touched && (f['confirmPassword'].invalid || registerForm.hasError('mismatch'))" 
                />
                <div class="form-error" *ngIf="f['confirmPassword'].touched && registerForm.hasError('mismatch')">
                  Passwords do not match
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions-bar">
            <div class="terms-note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Submitted applications require verification by a certified Health Authority Officer before full portal access is activated.</span>
            </div>

            <div class="buttons-row">
              <a routerLink="/register" class="btn btn-secondary">
                &larr; Switch Role
              </a>
              <button type="submit" class="btn btn-primary btn-lg" [disabled]="isLoading">
                <span *ngIf="!isLoading">Submit Hospital Registration</span>
                <span *ngIf="isLoading">Submitting Application...</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
    <app-footer></app-footer>
  </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }
    .page-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }
    .register-wrapper {
      flex: 1;
      padding: 2.5rem 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }
    .register-container {
      max-width: 920px;
      margin: 0 auto;
    }
    .badge-role {
      font-size: 0.75rem;
      font-weight: 700;
      color: #dc2626;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.25rem;
    }
    .register-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-bottom: 0.35rem;
    }
    .page-subtitle {
      font-size: 0.9375rem;
      color: #64748b;
    }
    .autofill-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 0.55rem 1rem;
      border-radius: 9px;
      font-weight: 600;
      font-size: 0.8125rem;
      color: #334155;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.15s;
    }
    .autofill-btn:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .form-section-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
    }
    .section-badge {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .step-num {
      width: 34px;
      height: 34px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 10px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .section-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.2rem;
    }
    .section-desc {
      font-size: 0.8125rem;
      color: #64748b;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    .col-span-2 {
      grid-column: span 2;
    }
    .req {
      color: #ef4444;
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
    .form-control {
      width: 100%;
      padding: 0.65rem 0.875rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.875rem;
      outline: none;
      transition: all 0.15s;
    }
    .form-control:focus {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
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
    .coord-guide-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #0284c7;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-top: 0.25rem;
    }
    .coord-guide-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #0369a1;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    .coord-guide-content {
      font-size: 0.8125rem;
      color: #334155;
      line-height: 1.5;
    }
    .coord-guide-content .guide-intro {
      margin-bottom: 0.35rem;
      font-weight: 500;
    }
    .coord-guide-content ol {
      margin: 0;
      padding-left: 1.25rem;
    }
    .coord-guide-content li {
      margin-bottom: 0.25rem;
    }
    .coord-guide-content code {
      background: #e2e8f0;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      font-weight: 600;
      color: #0f172a;
    }
    .form-actions-bar {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
    }
    .terms-note {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.8125rem;
      color: #64748b;
    }
    .terms-note svg {
      color: #0284c7;
      flex-shrink: 0;
    }
    .buttons-row {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .btn {
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
      transition: all 0.15s;
    }
    .btn-primary {
      background: #dc2626;
      color: #ffffff;
    }
    .btn-primary:hover:not(:disabled) {
      background: #b91c1c;
      transform: translateY(-1px);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #e2e8f0;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .col-span-2 {
        grid-column: span 1;
      }
    }
  `]
})
export class HospitalRegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(HospitalAuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = false;

  emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.(com|org|in|net|edu|gov)$/i;
  phoneRegex = /^[6-9][0-9]{9}$/;

  docLinkValidator(control: any) {
    if (!control.value) return null;
    const val = String(control.value).toLowerCase().trim();
    if (val.includes('.com') || val.includes('.pdf')) {
      return null;
    }
    return { invalidDocLink: true };
  }

  registerForm: FormGroup = this.fb.group({
    hospitalName: ['', [Validators.required, noDigitsValidator()]],
    type: ['Multi-Specialty Hospital', [Validators.required]],
    licenseNumber: ['', [Validators.required]],
    abdmHfrId: ['', [Validators.required]],
    licenseCertificateLink: ['', [Validators.required, this.docLinkValidator]],
    address: ['', [Validators.required]],
    latitude: [19.0760, [Validators.required]],
    longitude: [72.8777, [Validators.required]],
    officialHospitalEmail: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    hospitalContactNumber: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
    registrantName: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    employeeId: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
    email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: (group) => {
      const p = group.get('password')?.value;
      const cp = group.get('confirmPassword')?.value;
      return p === cp ? null : { mismatch: true };
    }
  });

  ngOnInit(): void {
    // Clear any prior hospital/admin session so registration starts in fresh unauthenticated state
    this.authService.logout(false);
  }

  get f() {
    return this.registerForm.controls;
  }

  fillDemoData(): void {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    this.registerForm.patchValue({
      hospitalName: 'Apex Memorial Hospital',
      type: 'Multi-Specialty Hospital',
      licenseNumber: `LIC-MED-${randomId}`,
      abdmHfrId: `HFR-IN-${randomId}`,
      licenseCertificateLink: `https://mohfw.gov.in/registry/cert-${randomId}.pdf`,
      address: `Plot ${randomId}, Central Medical Corridor, Sector 4, Mumbai, Maharashtra`,
      latitude: 19.0760,
      longitude: 72.8777,
      officialHospitalEmail: `contact${randomId}@apexhospital.org`,
      hospitalContactNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      registrantName: 'Dr. Rajesh Sharma',
      designation: 'Head of Blood Transfusion Services',
      employeeId: `EMP-${randomId}`,
      phoneNumber: `91${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `dr.rajesh${randomId}@apexhospital.org`,
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    this.toastService.info('Populated registration form with valid test hospital data.', 'Test Data Ready');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastService.warning('Please fill in all mandatory fields with valid values before submitting.', 'Validation Incomplete');
      return;
    }

    const hospitalName = this.registerForm.get('hospitalName')?.value;
    const submittedEmail = this.registerForm.get('email')?.value?.trim().toLowerCase();

    this.isLoading = true;
    this.authService.signup(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success(
          `Registration submitted for "${hospitalName}"! Application is queued for Health Authority verification.`,
          'Registration Submitted'
        );
        this.toastService.info(
          `Use "${submittedEmail}" to log in once an administrator approves your license.`,
          'Next Step: Verification'
        );
        this.router.navigate(['/hospital/login'], { queryParams: { email: submittedEmail, registered: 'true' } });
      },
      error: (err: any) => {
        this.isLoading = false;
        const msg = err.error?.message || err.error || '';
        if (typeof msg === 'string' && msg.toLowerCase().includes('email already')) {
          this.toastService.error(
            `The login email "${submittedEmail}" is already registered. Please sign in or use another email.`,
            'Email Already Registered'
          );
        } else if (typeof msg === 'string' && msg.toLowerCase().includes('password')) {
          this.toastService.error(msg, 'Password Error');
        } else {
          this.toastService.error(
            typeof msg === 'string' && msg ? msg : 'Registration failed. Please check license number or official email uniqueness.',
            'Registration Failed'
          );
        }
      }
    });
  }
}
