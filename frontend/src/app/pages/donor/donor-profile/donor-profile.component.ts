import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DonorProfile } from '../models/donor-profile.model';
import { DonorService } from '../services/donor.service';
import { ToastService } from '../../../core/services/toast.service';
import { INDIAN_STATES } from '../../../core/constants/india-states.constant';
import { noDigitsValidator } from '../../../core/validators/custom-validators';

@Component({
  selector: 'app-donor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './donor-profile.component.html',
  styleUrl: './donor-profile.component.css',
})
export class DonorProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private donorService = inject(DonorService);
  private toastService = inject(ToastService);

  private _donor!: DonorProfile;
  originalEmail = '';
  originalPhone = '';

  isSaving = false;
  simultaneousChangeError = false;
  indianStates = INDIAN_STATES;

  profileForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, noDigitsValidator()]],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['Maharashtra', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadProfile();

    // Listen for simultaneous changes to email and phone (Requirement 16)
    this.profileForm.valueChanges.subscribe((vals) => {
      const emailChanged = vals.email && vals.email.trim().toLowerCase() !== this.originalEmail.trim().toLowerCase();
      const phoneChanged = vals.mobileNumber && vals.mobileNumber.trim() !== this.originalPhone.trim();
      this.simultaneousChangeError = Boolean(emailChanged && phoneChanged);
    });
  }

  get donor(): DonorProfile {
    return this._donor;
  }

  loadProfile(): void {
    this.donorService.getProfile().subscribe({
      next: (response) => {
        this._donor = response;
        this.originalEmail = response.email || '';
        this.originalPhone = response.mobileNumber || '';

        this.profileForm.patchValue({
          fullName: response.fullName,
          email: response.email,
          mobileNumber: response.mobileNumber,
          address: response.address,
          city: response.city,
          state: response.state || 'Maharashtra',
        });

        this.profileForm.markAsPristine();
      },
      error: (error) => {
        this.toastService.error('Failed to retrieve donor profile from server.', 'Profile Load Error');
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.toastService.warning('Please fix validation errors before saving.', 'Form Incomplete');
      return;
    }

    // Enforce restriction against simultaneous email & phone changes (Requirement 16)
    const emailChanged = this.profileForm.value.email.trim().toLowerCase() !== this.originalEmail.trim().toLowerCase();
    const phoneChanged = this.profileForm.value.mobileNumber.trim() !== this.originalPhone.trim();

    if (emailChanged && phoneChanged) {
      this.simultaneousChangeError = true;
      this.toastService.error(
        'For security and anti-fraud verification, updating both email and mobile number simultaneously is prohibited. Please update one at a time.',
        'Security Restriction'
      );
      return;
    }

    this.isSaving = true;
    this.donorService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this._donor = response;
        this.originalEmail = response.email || '';
        this.originalPhone = response.mobileNumber || '';

        this.profileForm.patchValue({
          fullName: response.fullName,
          email: response.email,
          mobileNumber: response.mobileNumber,
          address: response.address,
          city: response.city,
          state: response.state,
        });

        this.profileForm.markAsPristine();
        this.simultaneousChangeError = false;
        this.isSaving = false;
        this.toastService.success('Donor profile credentials updated successfully!', 'Profile Saved');
      },
      error: (error) => {
        this.isSaving = false;
        const msg = error?.error?.message || error?.error || 'Unable to update profile. Please try again.';
        this.toastService.error(typeof msg === 'string' ? msg : 'Update Failed', 'Profile Error');
      }
    });
  }
}