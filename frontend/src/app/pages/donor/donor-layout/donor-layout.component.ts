import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DonorService } from '../services/donor.service';
import { DonorProfile } from '../models/donor-profile.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-donor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ConfirmDialogComponent, AppFooterComponent],
  templateUrl: './donor-layout.component.html',
  styleUrl: './donor-layout.component.css',
})
export class DonorLayoutComponent implements OnInit {
  private donorService = inject(DonorService);
  private router = inject(Router);

  donor: DonorProfile | null = null;
  pendingRequests: any[] = [];
  showNotifications = false;
  showLogoutModal = false;

  ngOnInit(): void {
    this.donorService.getProfile().subscribe({
      next: (response) => {
        this.donor = response;
      },
      error: () => {},
    });

    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.donorService.getPendingDonationRequests().subscribe({
      next: (response) => {
        this.pendingRequests = response;
      },
      error: () => {},
    });
  }

  get donorInitial(): string {
    return this.donor?.fullName?.charAt(0) || 'D';
  }

  getCleanDonorName(): string {
    if (!this.donor?.fullName) return 'Verified Donor';
    return this.donor.fullName.replace(/\s*\d+.*$/, '').trim();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  onLogout(): void {
    this.showLogoutModal = true;
  }

  onConfirmLogout(): void {
    this.showLogoutModal = false;
    localStorage.removeItem('donorToken');
    localStorage.removeItem('donorUser');
    this.router.navigate(['/']);
  }
}
