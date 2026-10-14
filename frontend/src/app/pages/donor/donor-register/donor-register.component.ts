import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DonorAuthService } from '../../../core/services/donor-auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { INDIAN_STATES } from '../../../core/constants/india-states.constant';
import { DONOR_BLOOD_GROUPS } from '../../../core/constants/blood-groups.constant';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';
import { noDigitsValidator } from '../../../core/validators/custom-validators';

@Component({
  selector: 'app-donor-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AppFooterComponent],
  templateUrl: './donor-register.component.html',
  styleUrls: ['./donor-register.component.css']
})
export class DonorRegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private donorAuthService = inject(DonorAuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private http = inject(HttpClient);

  currentStep = 1;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  showHbInfo = false;

  indianStates = INDIAN_STATES;
  bloodGroups = DONOR_BLOOD_GROUPS;
  bloodBanksList: any[] = [];

  emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
  phoneRegex = /^[6-9][0-9]{9}$/;

  donorForm: FormGroup = this.fb.group({
    // Step 1: Account
    fullName: ['', [Validators.required, Validators.minLength(3), noDigitsValidator()]],
    username: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
    email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    mobileNumber: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],

    // Step 2: Health & Eligibility
    gender: ['MALE', [Validators.required]],
    dateOfBirth: ['', [Validators.required, this.ageValidator]],
    bloodGroup: ['O_POSITIVE', [Validators.required]],
    weight: [60, [Validators.required, Validators.min(45), Validators.max(200)]],
    hemoglobin: [13.5, [Validators.required, Validators.min(12.5), Validators.max(20.0)]],

    // Step 3: Affiliation & Address
    bloodBankId: [1, [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['Maharashtra', [Validators.required]]
  }, {
    validators: (group) => {
      const p = group.get('password')?.value;
      const cp = group.get('confirmPassword')?.value;
      return p === cp ? null : { mismatch: true };
    }
  });

  ngOnInit(): void {
    this.loadBloodBanks();
  }

  get f() {
    return this.donorForm.controls;
  }

  // Age restriction validator: 18 to 65 years (Requirement 14)
  ageValidator(control: AbstractControl) {
    if (!control.value) return null;
    const dob = new Date(control.value);
    const today = new Date();
    
    if (isNaN(dob.getTime())) return { invalidDate: true };
    if (dob > today) return { futureDate: true };

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return { underAge: true, age };
    }
    if (age > 65) {
      return { overAge: true, age };
    }
    return null;
  }

  loadBloodBanks(): void {
    this.http.get<any[]>(`${environment.apiUrl}/bloodbanks`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.bloodBanksList = data;
          this.donorForm.patchValue({ bloodBankId: data[0].id });
        } else {
          this.fallbackBloodBanks();
        }
      },
      error: () => {
        this.fallbackBloodBanks();
      }
    });
  }

  private fallbackBloodBanks(): void {
    this.bloodBanksList = [
      { id: 1, bloodBankName: 'Red Cross Regional Blood Center', city: 'Mumbai' },
      { id: 2, bloodBankName: 'Metropolitan Blood Transfusion Bank', city: 'Mumbai' },
      { id: 3, bloodBankName: 'State Blood Transfusion Council', city: 'Pune' },
      { id: 4, bloodBankName: 'Apex Health Blood Reserve', city: 'Thane' }
    ];
    this.donorForm.patchValue({ bloodBankId: 1 });
  }

  isStep1Valid(): boolean {
    const fields = ['fullName', 'username', 'email', 'mobileNumber', 'password', 'confirmPassword'];
    const fieldsValid = fields.every(f => this.donorForm.get(f)?.valid);
    return fieldsValid && !this.donorForm.hasError('mismatch');
  }

  isStep2Valid(): boolean {
    const fields = ['gender', 'dateOfBirth', 'bloodGroup', 'weight', 'hemoglobin'];
    return fields.every(f => this.donorForm.get(f)?.valid);
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.isStep1Valid()) {
        const fields = ['fullName', 'username', 'email', 'mobileNumber', 'password', 'confirmPassword'];
        fields.forEach(f => this.donorForm.get(f)?.markAsTouched());
        if (this.donorForm.hasError('mismatch')) {
          this.toastService.warning('Passwords do not match.', 'Security Mismatch');
        } else {
          this.toastService.warning('Please complete all account fields correctly.', 'Validation Required');
        }
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (!this.isStep2Valid()) {
        const fields = ['gender', 'dateOfBirth', 'bloodGroup', 'weight', 'hemoglobin'];
        fields.forEach(f => this.donorForm.get(f)?.markAsTouched());
        
        const dobErrors = this.donorForm.get('dateOfBirth')?.errors;
        if (dobErrors?.['underAge']) {
          this.toastService.error('Donors must be at least 18 years old to register.', 'Age Requirement');
        } else if (dobErrors?.['overAge']) {
          this.toastService.error('Maximum eligible age for voluntary blood donation is 65 years.', 'Age Limit');
        } else {
          this.toastService.warning('Please ensure all health parameters meet medical donation standards (Weight ≥ 45 kg, Hb ≥ 12.5 g/dL).', 'Health Criteria');
        }
        return;
      }
      this.currentStep = 3;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  fillDemoData(): void {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    this.donorForm.patchValue({
      fullName: 'Rahul Sharma',
      username: `rahul_donor_${randomId}`,
      email: `donor${randomId}@example.com`,
      mobileNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      gender: 'MALE',
      dateOfBirth: '1998-05-14',
      bloodGroup: 'O_POSITIVE',
      weight: 68,
      hemoglobin: 14.2,
      bloodBankId: 1,
      address: 'Flat 402, Shanti Heights, Sector 7',
      city: 'Mumbai',
      state: 'Maharashtra'
    });
    this.toastService.info('Populated registration form with valid test donor profile.', 'Demo Donor Loaded');
  }

  submitForm(): void {
    if (this.donorForm.invalid) {
      this.donorForm.markAllAsTouched();
      this.toastService.warning('Please review and correct validation errors before registering.', 'Form Incomplete');
      return;
    }

    const formVal = this.donorForm.value;
    if (!formVal.password || !String(formVal.password).trim()) {
      this.toastService.warning('Password is required. Please enter your password and try again.', 'Password Required');
      return;
    }

    this.isLoading = true;

    this.donorAuthService.registerDonor(formVal).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.success(
          `Welcome to the LifeLink Donor Community, ${formVal.fullName}! Your donor profile is active.`,
          'Registration Successful'
        );
        this.router.navigate(['/donor/login'], { queryParams: { registered: 'true', username: formVal.username } });
      },
      error: (error) => {
        this.isLoading = false;
        let msg = error?.error?.message || error?.error;
        if (!msg || typeof msg !== 'string') {
          msg = 'Registration failed. Please verify that your email, mobile number, and username are unique and valid.';
        } else if (msg.includes('SQL') || msg.includes('statement') || msg.includes('NULL not allowed')) {
          msg = 'Password is required. Please enter your password and try again.';
        }
        this.toastService.error(msg, 'Registration Failed');
      }
    });
  }
}
