import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HospitalAuthService } from '../../../core/services/hospital-auth.service';
import { HospitalBloodRequestService } from '../../../core/services/hospital-request.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { interval, Subscription, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-hospital-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  template: `
    <header class="navbar-header" [class.admin-nav]="authService.isAdmin()">
      <div class="navbar-container">
        <!-- Brand Logo -->
        <a routerLink="/" class="navbar-brand">
          <div class="brand-icon" [class.brand-icon-admin]="authService.isAdmin()">
            <svg *ngIf="!authService.isAdmin()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <svg *ngIf="authService.isAdmin()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">{{ authService.isAdmin() ? 'LifeLink Authority' : 'LifeLink' }}</span>
            <span class="brand-tag">{{ authService.isAdmin() ? 'Accreditation & Registry' : 'Hospital Network' }}</span>
          </div>
        </a>

        <!-- Navigation Links: Hospital -->
        <nav class="nav-menu" *ngIf="authService.isAuthenticated() && !authService.isAdmin()">
          <a routerLink="/hospital/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"></rect>
              <rect width="7" height="5" x="14" y="3" rx="1"></rect>
              <rect width="7" height="9" x="14" y="12" rx="1"></rect>
              <rect width="7" height="5" x="3" y="16" rx="1"></rect>
            </svg>
            <span>Dashboard</span>
          </a>

          <a routerLink="/hospital/inventory" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <path d="m3.3 7 8.7 5 8.7-5"></path>
              <path d="M12 22V12"></path>
            </svg>
            <span>Blood Inventory</span>
          </a>

          <a routerLink="/hospital/requests" routerLinkActive="active" class="nav-item nav-item-badge-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
            <span>Emergency Requests</span>
            <span *ngIf="unreadCount > 0" class="badge-counter pulse">{{ unreadCount }}</span>
          </a>

          <a routerLink="/hospital/profile" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>My Profile</span>
          </a>
        </nav>

        <!-- Navigation Links: Admin -->
        <nav class="nav-menu" *ngIf="authService.isAdmin()">
          <a routerLink="/admin/verify" routerLinkActive="active" class="nav-item nav-item-admin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span>Hospital Verification Queue</span>
          </a>
        </nav>

        <!-- Right Side Actions -->
        <div class="nav-actions">
          <ng-container *ngIf="authService.isAuthenticated(); else guestLinks">
            <div class="user-pill" [class.user-pill-admin]="authService.isAdmin()">
              <div class="user-avatar" [class.user-avatar-admin]="authService.isAdmin()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="user-text-info">
                <span class="user-role-label">{{ authService.isAdmin() ? 'Health Authority Officer' : 'Hospital' }}</span>
                <span class="user-email" [title]="authService.displayName() || authService.currentUser()">
                  {{ authService.displayName() || authService.currentUser() }}
                </span>
              </div>
            </div>

            <button class="btn btn-secondary btn-sm" (click)="showLogoutModal = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </ng-container>

          <ng-template #guestLinks>
            <a routerLink="/admin/login" class="nav-item guest-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              </svg>
              <span>Authority Portal</span>
            </a>
            <a routerLink="/hospital/login" class="btn btn-secondary btn-sm">Hospital Login</a>
            <a routerLink="/hospital/register" class="btn btn-primary btn-sm">Register Hospital</a>
          </ng-template>
        </div>
      </div>
    </header>

    <!-- Logout Confirmation Modal (Requirement 22) -->
    <app-confirm-dialog
      [isOpen]="showLogoutModal"
      title="Sign Out of Session"
      message="Are you sure you want to log out of your Hospital session?"
      confirmText="Yes, Logout"
      cancelText="Stay Signed In"
      type="logout"
      (confirmed)="onConfirmLogout()"
      (cancelled)="showLogoutModal = false"
    ></app-confirm-dialog>
  `,
  styles: [`
    .navbar-header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(8px);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .admin-nav {
      border-bottom: 2px solid #0f766e;
    }
    .navbar-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: #ffffff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3);
    }
    .brand-icon-admin {
      background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
      box-shadow: 0 4px 10px rgba(15, 118, 110, 0.3);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .brand-tag {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      color: #475569;
      transition: all 0.15s ease;
    }
    .nav-item:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .nav-item.active {
      background: #fef2f2;
      color: #dc2626;
      font-weight: 600;
    }
    .nav-item-admin.active {
      background: #f0fdfa;
      color: #0f766e;
      font-weight: 600;
    }
    .guest-nav-item {
      color: #0f766e;
      font-weight: 600;
    }
    .nav-item-badge-wrap {
      position: relative;
    }
    .badge-counter {
      background: #dc2626;
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.1rem 0.45rem;
      border-radius: 9999px;
      margin-left: 0.25rem;
    }
    .pulse {
      animation: pulse 2s infinite;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
    }
    .user-pill-admin {
      background: #f0fdfa;
      border-color: #ccfbf1;
    }
    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #fee2e2;
      color: #dc2626;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-avatar-admin {
      background: #ccfbf1;
      color: #0f766e;
    }
    .user-text-info {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .user-role-label {
      font-size: 0.65rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .user-email {
      font-size: 0.8125rem;
      color: #0f172a;
      font-weight: 600;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
      transition: all 0.15s;
    }
    .btn-sm {
      padding: 0.35rem 0.75rem;
      font-size: 0.8125rem;
    }
    .btn-primary {
      background: #dc2626;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #b91c1c;
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #e2e8f0;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.08); }
    }
    @media (max-width: 900px) {
      .nav-menu {
        display: none;
      }
    }
  `]
})
export class HospitalNavbarComponent implements OnInit, OnDestroy {
  authService = inject(HospitalAuthService);
  private bloodRequestService = inject(HospitalBloodRequestService);

  unreadCount = 0;
  showLogoutModal = false;
  private pollSub?: Subscription;

  ngOnInit(): void {
    if (!this.authService.isAdmin() && this.authService.isAuthenticated()) {
      this.pollSub = interval(30000)
        .pipe(
          startWith(0),
          switchMap(() => this.bloodRequestService.getMyHospitalRequests())
        )
        .subscribe({
          next: (requests) => {
            this.unreadCount = (requests || []).length;
          },
          error: () => {
            this.unreadCount = 0;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  onLogout(): void {
    this.showLogoutModal = true;
  }

  onConfirmLogout(): void {
    this.showLogoutModal = false;
    this.authService.logout();
  }
}
