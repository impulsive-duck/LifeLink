import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BloodBankService } from '../../../core/services/blood-bank.service';
import { ToastService } from '../../../core/services/toast.service';
import { INDIAN_STATES } from '../../../core/constants/india-states.constant';
import { BLOOD_BANK_TYPES } from '../../../core/constants/blood-groups.constant';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';
import { noDigitsValidator } from '../../../core/validators/custom-validators';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AppFooterComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bloodBankService = inject(BloodBankService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  currentStep = 1;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  showLatLongHelp = false;

  indianStates = INDIAN_STATES;
  bloodBankTypes = BLOOD_BANK_TYPES;

  emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
  phoneRegex = /^[6-9][0-9]{9}$/;

  docLinkValidator(control: AbstractControl) {
    if (!control.value) return null;
    const val = String(control.value).toLowerCase().trim();
    if (val.includes('.com') || val.includes('.pdf')) {
      return null;
    }
    return { invalidDocLink: true };
  }

  regForm: FormGroup = this.fb.group({
    // Step 1: Blood Bank Facility Details
    bloodBankName: ['', [Validators.required, Validators.minLength(3), noDigitsValidator()]],
    registrationNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\-_/]{4,25}$/)]],
    bloodBankType: ['Public / Government Blood Center', [Validators.required]],
    abdmHfrId: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['Maharashtra', [Validators.required]],
    pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    contactNumber: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
    email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    latitude: [19.0760, [Validators.required]],
    longitude: [72.8777, [Validators.required]],

    // Step 2: Authorized Person
    authorizedPersonName: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    authorizedPersonPhone: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
    authorizedPersonEmail: ['', [Validators.required, Validators.pattern(this.emailRegex)]],

    // Step 3: Documents
    registrationCertificate: ['', [Validators.required, this.docLinkValidator]],
    additionalDocuments: ['', [this.docLinkValidator]],

    // Step 4: Account Security
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
    // Clear any existing session to start fresh
    localStorage.removeItem('token');
    localStorage.removeItem('bloodBank');
  }

  get f() {
    return this.regForm.controls;
  }

  isStep1Valid(): boolean {
    const fields = ['bloodBankName', 'registrationNumber', 'bloodBankType', 'abdmHfrId', 'address', 'city', 'state', 'pinCode', 'contactNumber', 'email', 'latitude', 'longitude'];
    return fields.every(field => this.regForm.get(field)?.valid);
  }

  isStep2Valid(): boolean {
    const fields = ['authorizedPersonName', 'designation', 'authorizedPersonPhone', 'authorizedPersonEmail'];
    return fields.every(field => this.regForm.get(field)?.valid);
  }

  isStep3Valid(): boolean {
    return !!this.regForm.get('registrationCertificate')?.valid;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.isStep1Valid()) {
        const fields = ['bloodBankName', 'registrationNumber', 'bloodBankType', 'abdmHfrId', 'address', 'city', 'state', 'pinCode', 'contactNumber', 'email', 'latitude', 'longitude'];
        fields.forEach(f => this.regForm.get(f)?.markAsTouched());
        this.toastService.warning('Please complete all required facility details in Step 1 correctly.', 'Validation Required');
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (!this.isStep2Valid()) {
        const fields = ['authorizedPersonName', 'designation', 'authorizedPersonPhone', 'authorizedPersonEmail'];
        fields.forEach(f => this.regForm.get(f)?.markAsTouched());
        this.toastService.warning('Please complete all authorized person details in Step 2.', 'Validation Required');
        return;
      }
      this.currentStep = 3;
    } else if (this.currentStep === 3) {
      if (!this.isStep3Valid()) {
        this.regForm.get('registrationCertificate')?.markAsTouched();
        this.toastService.warning('Please provide a statutory registration certificate link/URL in Step 3.', 'Validation Required');
        return;
      }
      this.currentStep = 4;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }



  fillDemoData(): void {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    this.regForm.patchValue({
      bloodBankName: 'Red Cross Blood Center',
      registrationNumber: `BB-REG-${randomId}`,
      bloodBankType: 'Red Cross Society / NGO Facility',
      abdmHfrId: `ABDM-BB-${randomId}`,
      address: `Building ${randomId}, Health Complex, Central Boulevard`,
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      contactNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `bloodbank${randomId}@redcross.org`,
      latitude: 19.0760,
      longitude: 72.8777,
      authorizedPersonName: 'Dr. Sunita Patel',
      designation: 'Blood Bank Director & Transfusion Officer',
      authorizedPersonPhone: `91${Math.floor(10000000 + Math.random() * 90000000)}`,
      authorizedPersonEmail: `director${randomId}@redcross.org`,
      registrationCertificate: `https://mohfw.gov.in/bbms/cert-${randomId}.pdf`,
      additionalDocuments: `https://mohfw.gov.in/bbms/nabh-${randomId}.pdf`,
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    this.toastService.info('Populated registration form with valid test blood bank data.', 'Demo Data Loaded');
  }

  submitForm(): void {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      this.toastService.warning('Please correct all validation errors before submitting.', 'Form Incomplete');
      return;
    }

    this.isLoading = true;
    const formVal = this.regForm.value;

    this.bloodBankService.registerBloodBank(formVal).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.success(
          `Blood Bank "${formVal.bloodBankName}" registered successfully! Awaiting Health Authority regulatory verification.`,
          'Registration Submitted'
        );
        this.toastService.info(
          `Login will be enabled once an Administrator approves license #${formVal.registrationNumber}.`,
          'Next Step'
        );
        this.router.navigate(['/blood-bank/login'], { queryParams: { registered: 'true', email: formVal.email } });
      },
      error: (err: any) => {
        this.isLoading = false;
        const msg = err.error?.message || err.error || 'Registration failed. Please check your data.';
        this.toastService.error(typeof msg === 'string' ? msg : 'Registration Failed', 'Submission Error');
      }
    });
  }
}