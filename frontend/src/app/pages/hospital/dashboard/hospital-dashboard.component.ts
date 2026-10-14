import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HospitalAuthService } from '../../../core/services/hospital-auth.service';
import { HospitalInventoryService } from '../../../core/services/hospital-inventory.service';
import { HospitalBloodRequestService } from '../../../core/services/hospital-request.service';
import { BloodInventory, HOSPITAL_BLOOD_GROUPS } from '../../../core/models/hospital-inventory.model';
import { BloodRequest } from '../../../core/models/hospital-request.model';
import { ToastService } from '../../../core/services/toast.service';
import { HospitalNavbarComponent } from '../../../shared/components/hospital-navbar/hospital-navbar.component';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-hospital-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HospitalNavbarComponent, AppFooterComponent],
  template: `
    <div class="page-layout">
      <app-hospital-navbar></app-hospital-navbar>
      <main class="dashboard-wrapper">
        <div class="dashboard-container">
        <!-- Welcome Hero -->
        <div class="hero-banner">
          <div class="hero-content">
            <div class="hero-badge-row">
              <span class="hero-badge">Verified Healthcare Facility</span>
              <span class="verified-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Reg. Approved
              </span>
            </div>
            <h1 class="hero-title">Hospital Dashboard</h1>
            <p class="hero-subtitle">
              Welcome, <strong>{{ getCleanHospitalName() }}</strong>. Manage your on-site blood reserves and coordinate regional emergency blood dispatches in real time.
            </p>
          </div>
          <div class="hero-actions">
            <a routerLink="/hospital/requests" class="btn btn-emergency">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Emergency Dispatch</span>
            </a>
            <a routerLink="/hospital/inventory" class="btn btn-outline-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              </svg>
              <span>Manage Inventory</span>
            </a>
          </div>
        </div>

        <!-- Metrics Overview Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon icon-crimson">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <div class="metric-data">
              <span class="metric-label">Total Blood Stock</span>
              <div class="metric-val">{{ totalUnits }} <span class="metric-unit">Units</span></div>
              <span class="metric-hint">Across all 8 blood groups</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon icon-amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div class="metric-data">
              <span class="metric-label">Critical Shortages</span>
              <div class="metric-val">{{ criticalCount }} <span class="metric-unit">Groups</span></div>
              <span class="metric-hint">{{ criticalCount > 0 ? 'Units below safety threshold (<5)' : 'All groups within safe levels' }}</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon icon-teal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
            </div>
            <div class="metric-data">
              <span class="metric-label">Active Emergency Requests</span>
              <div class="metric-val">{{ pendingDispatchCount }} <span class="metric-unit">Active ({{ myRequests.length }} Total)</span></div>
              <span class="metric-hint">Your live emergency blood dispatches</span>
            </div>
          </div>
        </div>

        <!-- Two Column Content -->
        <div class="content-split-grid">
          <!-- Left: Quick Stock Matrix -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title-wrap">
                <h2 class="panel-title">Blood Inventory Snapshot</h2>
                <span class="panel-subtitle">Current on-site reserves</span>
              </div>
              <a routerLink="/hospital/inventory" class="panel-link">Manage Stock &rarr;</a>
            </div>

            <div class="blood-matrix-grid">
              <div *ngFor="let bg of bloodGroups" class="blood-matrix-cell" [class.cell-critical]="getUnits(bg) < 5">
                <div class="group-tag">{{ bg }}</div>
                <div class="group-count">{{ getUnits(bg) }} <span class="unit-text">units</span></div>
                <div class="group-status-pill" [ngClass]="getStockStatusClass(getUnits(bg))">
                  {{ getStockStatusLabel(getUnits(bg)) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Urgent Outbound Requests Feed -->
          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title-wrap">
                <h2 class="panel-title">My Emergency Blood Requests</h2>
                <span class="panel-subtitle">Live outbound requirement status</span>
              </div>
              <a routerLink="/hospital/requests" class="panel-link">Raise Request &rarr;</a>
            </div>

            <div class="requests-list" *ngIf="myRequests.length > 0; else noRequests">
              <div *ngFor="let req of myRequests.slice(0, 4)" class="request-item">
                <div class="req-blood-badge">
                  {{ req.bloodGroup }}
                </div>
                <div class="req-details">
                  <div class="req-hospital-name">{{ req.bloodBank?.bloodBankName || 'Regional Blood Bank' }}</div>
                  <div class="req-meta">
                    <span>Required: <strong>{{ req.dateOfRequirement }}</strong></span>
                    <span>&bull;</span>
                    <span>Units: <strong>{{ req.numberOfUnits }}</strong></span>
                  </div>
                </div>
                <span class="badge" [ngClass]="getRequestStatusClass(req.status)">
                  {{ req.status || 'PENDING' }}
                </span>
              </div>
            </div>

            <ng-template #noRequests>
              <div class="empty-state-box">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p class="empty-text">No active emergency blood requests right now.</p>
                <a routerLink="/hospital/requests" class="btn btn-sm btn-primary" style="margin-top: 0.5rem;">
                  Raise Emergency Request
                </a>
              </div>
            </ng-template>
          </div>
        </div>
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
    .dashboard-wrapper {
      flex: 1;
      padding: 2rem 1.5rem;
      background: #f8fafc;
    }
    .dashboard-container {
      max-width: 1250px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .hero-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      border-radius: 18px;
      padding: 2.25rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
    }
    .hero-badge-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .verified-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }
    .hero-title {
      font-size: 1.85rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
      color: #ffffff !important;
    }
    .hero-subtitle {
      font-size: 0.9375rem;
      color: #cbd5e1;
      max-width: 650px;
      line-height: 1.6;
    }
    .hero-subtitle strong {
      color: #ffffff;
      font-weight: 700;
    }
    .hero-subtitle code {
      background: rgba(255, 255, 255, 0.15);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #fca5a5;
    }
    .user-highlight {
      color: #ffffff;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn {
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9375rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-emergency {
      background: #dc2626;
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
    }
    .btn-emergency:hover {
      background: #b91c1c;
      transform: translateY(-1px);
    }
    .btn-outline-white {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .btn-outline-white:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .btn-sm {
      padding: 0.35rem 0.75rem;
      font-size: 0.8125rem;
    }
    .btn-outline {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }
    .btn-outline:hover {
      background: #f1f5f9;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .metric-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }
    .metric-icon {
      width: 54px;
      height: 54px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .icon-crimson { background: #fee2e2; color: #dc2626; }
    .icon-amber { background: #fef3c7; color: #d97706; }
    .icon-teal { background: #ccfbf1; color: #0f766e; }

    .metric-label {
      font-size: 0.8125rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .metric-val {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      margin: 0.2rem 0;
    }
    .metric-unit {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #64748b;
    }
    .metric-hint {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .content-split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .panel-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .panel-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.15rem;
    }
    .panel-subtitle {
      font-size: 0.8125rem;
      color: #64748b;
    }
    .panel-link {
      font-size: 0.875rem;
      font-weight: 600;
      color: #dc2626;
      text-decoration: none;
    }
    .panel-link:hover {
      text-decoration: underline;
    }
    .blood-matrix-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.875rem;
    }
    .blood-matrix-cell {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem 0.75rem;
      text-align: center;
      transition: all 0.15s;
    }
    .cell-critical {
      border-color: #fecaca;
      background: #fff5f5;
    }
    .group-tag {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 0.25rem;
    }
    .group-count {
      font-size: 1.25rem;
      font-weight: 700;
      color: #dc2626;
    }
    .unit-text {
      font-size: 0.75rem;
      font-weight: 500;
      color: #64748b;
    }
    .group-status-pill {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      display: inline-block;
      margin-top: 0.4rem;
    }
    .status-critical { background: #fee2e2; color: #b91c1c; }
    .status-low { background: #fef3c7; color: #b45309; }
    .status-good { background: #dcfce7; color: #15803d; }

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .request-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }
    .req-blood-badge {
      width: 40px;
      height: 40px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 10px;
      font-weight: 800;
      font-size: 0.9375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .req-details {
      flex: 1;
    }
    .req-hospital-name {
      font-weight: 600;
      font-size: 0.9375rem;
      color: #0f172a;
    }
    .req-meta {
      font-size: 0.8125rem;
      color: #64748b;
      display: flex;
      gap: 0.5rem;
      margin-top: 0.15rem;
    }
    .empty-state-box {
      padding: 2.5rem 1rem;
      text-align: center;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .empty-text {
      font-size: 0.875rem;
      color: #64748b;
    }
    @media (max-width: 900px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      .content-split-grid {
        grid-template-columns: 1fr;
      }
      .blood-matrix-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class HospitalDashboardComponent implements OnInit {
  authService = inject(HospitalAuthService);
  private inventoryService = inject(HospitalInventoryService);
  private bloodRequestService = inject(HospitalBloodRequestService);
  private toastService = inject(ToastService);

  hospitalProfile: any = null;
  bloodGroups: string[] = HOSPITAL_BLOOD_GROUPS;
  inventoryMap = new Map<string, number>();
  totalUnits = 0;
  criticalCount = 0;
  myRequests: BloodRequest[] = [];
  donorResponses: any[] = [];

  get pendingDispatchCount(): number {
    return this.myRequests.filter(r => !r.status || r.status === 'PENDING').length;
  }

  ngOnInit(): void {
    this.loadData();
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getCurrentProfile().subscribe({
      next: (profile: any) => {
        this.hospitalProfile = profile;
      },
      error: () => {}
    });
  }

  loadData(): void {
    this.inventoryService.getMyInventory().subscribe({
      next: (items: BloodInventory[]) => {
        this.inventoryMap.clear();
        let total = 0;
        let crit = 0;

        if (items && items.length > 0) {
          items.forEach((item: BloodInventory) => {
            this.inventoryMap.set(item.bloodGroup, item.units);
            total += item.units;
            if (item.units < 5) crit++;
          });
        }

        this.bloodGroups.forEach((bg: string) => {
          if (!this.inventoryMap.has(bg)) {
            this.inventoryMap.set(bg, 0);
          }
        });

        this.totalUnits = total;
        this.criticalCount = crit;
      },
      error: () => {
        this.totalUnits = 0;
        this.criticalCount = 0;
        this.bloodGroups.forEach((bg: string) => {
          this.inventoryMap.set(bg, 0);
        });
      }
    });

    this.bloodRequestService.getMyHospitalRequests().subscribe({
      next: (reqs: BloodRequest[]) => {
        this.myRequests = reqs || [];
      },
      error: () => {
        this.myRequests = [];
      }
    });

    this.bloodRequestService.getHospitalDonationRequests().subscribe({
      next: (donors: any[]) => {
        this.donorResponses = donors || [];
      },
      error: () => {
        this.donorResponses = [];
      }
    });
  }

  getUnits(group: string): number {
    return this.inventoryMap.get(group) ?? 0;
  }

  getStockStatusLabel(units: number): string {
    if (units === 0) return 'Depleted';
    if (units < 5) return 'Critical';
    if (units < 15) return 'Moderate';
    return 'Adequate';
  }

  getStockStatusClass(units: number): string {
    if (units === 0) return 'status-critical';
    if (units < 5) return 'status-critical';
    if (units < 15) return 'status-low';
    return 'status-good';
  }

  getCleanHospitalName(): string {
    const raw = this.hospitalProfile?.hospitalName || this.authService.displayName() || 'Healthcare Facility';
    return raw.replace(/\s*#\d+.*$/, '').trim();
  }

  getRequestStatusClass(status?: string): string {
    if (!status || status === 'PENDING') return 'badge-warning';
    if (status === 'APPROVED' || status === 'FULFILLED') return 'badge-success';
    if (status === 'REJECTED') return 'badge-crimson';
    return 'badge-neutral';
  }
}
