import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DonorService } from '../services/donor.service';
import { DonorProfile } from '../models/donor-profile.model';
import { DonationRequest } from '../models/donor-request.model';
import { DonorProfileComponent } from '../donor-profile/donor-profile.component';
import { DonorRequestsComponent } from '../donor-requests/donor-requests.component';
import { DonorCertificatesComponent } from '../donor-certificates/donor-certificates.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DonorProfileComponent,
    DonorRequestsComponent,
    DonorCertificatesComponent,
  ],
  templateUrl: './donor-dashboard.component.html',
  styleUrl: './donor-dashboard.component.css',
})
export class DonorDashboardComponent implements OnInit {
  private donorService = inject(DonorService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  donor!: DonorProfile;
  requests: DonationRequest[] = [];
  pendingRequests: DonationRequest[] = [];
  selectedRequest: DonationRequest | null = null;
  certificateMap: Record<number, any> = {};
  certificates: any[] = [];
  selectedPage = 'home';
  selectedCertificateRequest: DonationRequest | null = null;
  showCertificateModal = false;
  selectedCertificateUrl: string | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('donorToken');
    if (!token) {
      this.toastService.warning('Please log in to access your donor dashboard.', 'Authentication Required');
      this.router.navigate(['/donor/login']);
      return;
    }

    this.loadProfile();
    this.loadDonationRequests();
    this.loadPendingRequests();
    this.loadCertificates();
  }

  loadProfile(): void {
    this.donorService.getProfile().subscribe({
      next: (response) => {
        if (!response) {
          localStorage.clear();
          this.router.navigate(['/donor/login']);
          return;
        }
        this.donor = response;
      },
      error: () => {
        localStorage.clear();
        this.toastService.error('Session expired. Please log in again.', 'Authentication Error');
        this.router.navigate(['/donor/login']);
      },
    });
  }

  loadCertificates(): void {
    this.donorService.getCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
        this.certificateMap = {};
        certificates.forEach((certificate) => {
          this.certificateMap[certificate.donationRequestId] = certificate;
        });
      },
      error: () => {},
    });
  }

  private isValidCertificateUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase().trim();
    const hasExt = ['.pdf', '.jpg', '.jpeg', '.png'].some(ext => lower.includes(ext));
    const hasDomain = ['http://', 'https://', '.com', '.org', '.gov', '.in', '.net', '.edu'].some(d => lower.includes(d));
    return hasExt || hasDomain;
  }

  private ensureAbsoluteUrl(url: string): string {
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  getCleanDonorName(): string {
    if (!this.donor?.fullName) return 'Verified Donor';
    return this.donor.fullName.replace(/\s*\d+.*$/, '').trim();
  }

  viewCertificateDirect(certificate: any): void {
    const url = certificate?.certificateUrl;
    if (url && this.isValidCertificateUrl(url)) {
      window.open(this.ensureAbsoluteUrl(url), '_blank');
    } else {
      this.toastService.warning('Please enter a valid certificate link. Use a valid URL or a certificate file format such as .pdf, .jpg, .jpeg or .png.', 'Invalid Certificate Link');
    }
  }

  loadDonationRequests(): void {
    this.donorService.getDonationRequests().subscribe({
      next: (response) => {
        this.requests = response;
      },
      error: () => {},
    });
  }

  openRequest(request: DonationRequest): void {
    this.donorService.getDonationRequestById(request.donationRequestId).subscribe({
      next: (response) => {
        this.selectedRequest = response;
      },
      error: () => {},
    });
  }

  closeRequestModal(): void {
    this.selectedRequest = null;
  }

  closeCertificateModal(): void {
    this.showCertificateModal = false;
    this.selectedCertificateRequest = null;
  }

  onCertificateUploaded(certificate: any): void {
    this.certificateMap[certificate.donationRequestId] = certificate;
    this.closeCertificateModal();
    this.loadCertificates();
    this.toastService.success('Donation certificate uploaded successfully!', 'Certificate Saved');
    if (certificate?.certificateId) {
      this.donorService.getCertificateFile(certificate.certificateId).subscribe({
        next: (resp: any) => {
          if (resp?.certificateUrl) {
            window.open(resp.certificateUrl, '_blank');
          }
        },
        error: () => {
          if (certificate?.certificateUrl) {
            window.open(certificate.certificateUrl, '_blank');
          }
        }
      });
    } else if (certificate?.donationRequestId) {
      this.viewCertificate(certificate.donationRequestId);
    }
  }

  loadPendingRequests(): void {
    this.donorService.getPendingDonationRequests().subscribe({
      next: (response) => {
        this.pendingRequests = response;
      },
      error: () => {},
    });
  }

  changePage(page: string): void {
    this.selectedPage = page;
  }

  acceptRequest(id: number): void {
    this.donorService.acceptRequest(id).subscribe({
      next: () => {
        const request = this.requests.find((r) => r.donationRequestId === id);
        if (request) {
          request.status = 'ACCEPTED';
        }
        this.pendingRequests = this.pendingRequests.filter(
          (r) => r.donationRequestId !== id,
        );
        this.selectedRequest = null;
        this.toastService.success('You have accepted this blood donation request. Thank you for saving a life!', 'Donation Accepted');
      },
      error: () => {
        this.toastService.error('Failed to accept donation request. Please try again.', 'Action Failed');
      },
    });
  }

  rejectRequest(id: number): void {
    this.donorService.rejectRequest(id).subscribe({
      next: () => {
        const request = this.requests.find((r) => r.donationRequestId === id);
        if (request) {
          request.status = 'REJECTED';
        }
        this.pendingRequests = this.pendingRequests.filter(
          (r) => r.donationRequestId !== id,
        );
        this.selectedRequest = null;
        this.toastService.info('Donation request declined.', 'Request Updated');
      },
      error: () => {
        this.toastService.error('Failed to update request. Please try again.', 'Action Failed');
      },
    });
  }

  openCertificateRequest(request: DonationRequest): void {
    this.selectedCertificateRequest = request;
    this.showCertificateModal = true;
  }

  getInitial(): string {
    return this.donor?.fullName?.charAt(0)?.toUpperCase() || 'D';
  }

  get acceptedRequests(): DonationRequest[] {
    return this.requests.filter(
      (r) =>
        r.status === 'ACCEPTED' ||
        !!this.certificateMap[r.donationRequestId]
    );
  }

  viewCertificate(requestId: number): void {
    const certificate = this.certificateMap[requestId];
    if (!certificate) {
      this.toastService.warning('No certificate record found for this request.', 'Document Missing');
      return;
    }

    if (!certificate.certificateId) {
      const url = certificate.certificateUrl;
      if (url && this.isValidCertificateUrl(url)) {
        window.open(this.ensureAbsoluteUrl(url), '_blank');
      } else {
        this.toastService.warning('Please enter a valid certificate link. Use a valid URL or a certificate file format such as .pdf, .jpg, .jpeg or .png.', 'Invalid Certificate Link');
      }
      return;
    }

    this.donorService.getCertificateFile(certificate.certificateId).subscribe({
      next: (response: any) => {
        const url = response?.certificateUrl || certificate.certificateUrl;
        if (url && this.isValidCertificateUrl(url)) {
          window.open(this.ensureAbsoluteUrl(url), '_blank');
        } else {
          this.toastService.warning('Please enter a valid certificate link. Use a valid URL or a certificate file format such as .pdf, .jpg, .jpeg or .png.', 'Invalid Certificate Link');
        }
      },
      error: () => {
        const url = certificate.certificateUrl;
        if (url && this.isValidCertificateUrl(url)) {
          window.open(this.ensureAbsoluteUrl(url), '_blank');
        } else {
          this.toastService.warning('Unable to open certificate document. Please verify the document link.', 'Certificate View Error');
        }
      },
    });
  }
}
