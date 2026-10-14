import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { DonationRequest } from '../models/donor-request.model';
import { DonorService } from '../services/donor.service';

@Component({
  selector: 'app-donor-certificates',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './donor-certificates.component.html',
  styleUrl: './donor-certificates.component.css',
})
export class DonorCertificatesComponent {
  @Input()
  request!: DonationRequest;

  @Input()
  set donationRequest(val: DonationRequest | null | undefined) {
    if (val) {
      this.request = val;
      if (val.bloodBankId) {
        this.certificateForm.patchValue({
          issuingOrganizationId: String(val.bloodBankId)
        });
      }
    }
  }

  @Output()
  close = new EventEmitter<void>();

  @Output()
  certificateUploaded = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private toastr: ToastrService,
  ) {}

  docLinkValidator(control: AbstractControl) {
    if (!control.value) return null;
    const val = String(control.value).toLowerCase().trim();
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const hasValidExt = validExtensions.some(ext => val.includes(ext));
    const isValidUrl = val.startsWith('http://') || val.startsWith('https://') || val.includes('.com') || val.includes('.org') || val.includes('.gov') || val.includes('.in') || val.includes('.net') || val.includes('.edu');
    if (hasValidExt || isValidUrl) {
      return null;
    }
    return { invalidDocLink: true };
  }

  certificateForm = this.fb.group({
    certificateNumber: ['', [Validators.required, Validators.minLength(3)]],
    issuingOrganizationName: ['', [Validators.required, Validators.minLength(3)]],
    issuingOrganizationId: ['', [Validators.required]],
    donationDate: ['', [Validators.required]],
    certificateUrl: ['', [Validators.required, this.docLinkValidator]],
  });

  uploadCertificate(): void {
    if (this.certificateForm.invalid) {
      this.certificateForm.markAllAsTouched();
      return;
    }

    const reqId = this.request?.donationRequestId;
    if (!reqId) return;

    this.donorService
      .uploadCertificate(
        reqId,
        this.certificateForm.value,
      )
      .subscribe({
        next: (response: any) => {
          this.donorService
            .requestVerification(response.certificateId)
            .subscribe({
              next: () => {
                response.verificationStatus = 'PENDING_VERIFICATION';

                this.toastr.success(
                  'Certificate uploaded and sent for verification',
                );

                this.certificateUploaded.emit(response);
              },

              error: (error) => {
                console.error(error);

                this.toastr.warning(
                  'Certificate uploaded but verification request failed',
                );

                this.certificateUploaded.emit(response);
              },
            });
        },
        error: (error) => {
          console.error(error);

          this.toastr.error('Failed to upload certificate');
        },
      });
  }
}
