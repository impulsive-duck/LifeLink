import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HospitalAuthService } from '../../../core/services/hospital-auth.service';
import { Hospital, CertificateResponse } from '../../../core/models/hospital-auth.model';
import { ToastService } from '../../../core/services/toast.service';
import { HospitalNavbarComponent } from '../../../shared/components/hospital-navbar/hospital-navbar.component';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';
import { environment } from '../../../../environments/environment';

export interface BloodBankItem {
  id: number;
  bloodBankName: string;
  registrationNumber: string;
  bloodBankType: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  contactNumber: string;
  email: string;
  abdmHfrId?: string;
  authorizedPersonName?: string;
  designation?: string;
  authorizedPersonPhone?: string;
  authorizedPersonEmail?: string;
  registrationCertificate?: string;
  additionalDocuments?: string;
  isVerified: boolean;
}

@Component({
  selector: 'app-admin-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, HospitalNavbarComponent, AppFooterComponent],
  template: `
    <app-hospital-navbar></app-hospital-navbar>
    <div class="admin-wrapper">
      <div class="admin-container">
        <!-- Header -->
        <div class="page-header">
          <div>
            <div class="badge-tag">Regulatory & Health Authority Governance</div>
            <h1 class="page-title">Healthcare Accreditation & Verification Portal</h1>
            <p class="page-subtitle">Review medical establishment and blood center credentials, inspect statutory documents, and authorize network access.</p>
          </div>

          <div class="header-actions">
            <button class="btn btn-secondary btn-sm" (click)="refreshCurrentTab()" [disabled]="isLoading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.spin]="isLoading">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 21h5v-5"></path>
              </svg>
              <span>Refresh Registry</span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs & Search Bar -->
        <div class="portal-toolbar">
          <div class="tabs-group">
            <button 
              class="tab-link" 
              [class.active]="activeTab === 'pending'" 
              (click)="switchTab('pending')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M9 12h6"></path>
                <path d="M12 9v6"></path>
              </svg>
              <span>Pending Hospitals</span>
              <span class="tab-pill" [class.tab-pill-warn]="pendingHospitals.length > 0">
                {{ pendingHospitals.length }}
              </span>
            </button>

            <button 
              class="tab-link" 
              [class.active]="activeTab === 'verified'" 
              (click)="switchTab('verified')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Verified Hospitals</span>
              <span class="tab-pill tab-pill-success">
                {{ verifiedHospitals.length }}
              </span>
            </button>

            <button 
              class="tab-link" 
              [class.active]="activeTab === 'bb-pending'" 
              (click)="switchTab('bb-pending')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              <span>Pending Blood Banks</span>
              <span class="tab-pill" [class.tab-pill-warn]="pendingBloodBanks.length > 0">
                {{ pendingBloodBanks.length }}
              </span>
            </button>

            <button 
              class="tab-link" 
              [class.active]="activeTab === 'bb-verified'" 
              (click)="switchTab('bb-verified')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Verified Blood Banks</span>
              <span class="tab-pill tab-pill-success">
                {{ verifiedBloodBanks.length }}
              </span>
            </button>
          </div>

          <div class="search-input-wrap">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              [(ngModel)]="searchQuery" 
              placeholder="Search by facility name, registration, city..."
            />
            <button class="btn-clear-search" *ngIf="searchQuery" (click)="searchQuery = ''">&times;</button>
          </div>
        </div>

        <!-- TAB 1: Pending Hospital Applications -->
        <div class="table-card" *ngIf="activeTab === 'pending'">
          <div class="card-top-bar">
            <div class="queue-status">
              <span class="status-indicator"></span>
              <strong>{{ filteredPendingHospitals.length }} Pending Hospital Application{{ filteredPendingHospitals.length === 1 ? '' : 's' }} Awaiting Review</strong>
            </div>
            <span class="queue-hint">Hospital accounts cannot sign in until authorized and verified.</span>
          </div>

          <div class="table-responsive" *ngIf="filteredPendingHospitals.length > 0; else emptyPendingHosp">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Hospital & Facility Info</th>
                  <th>License & ABDM HFR</th>
                  <th>Contact & Location</th>
                  <th>Authorized Registrant</th>
                  <th>Document</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let h of filteredPendingHospitals">
                  <td>
                    <div class="cell-main-title">{{ h.hospitalName }}</div>
                    <div class="cell-sub-tag">{{ h.type }}</div>
                  </td>
                  <td>
                    <div class="code-pill"><strong>Lic:</strong> {{ h.licenseNumber }}</div>
                    <div class="code-pill"><strong>HFR:</strong> {{ h.abdmHfrId }}</div>
                  </td>
                  <td>
                    <div class="cell-text">{{ h.address }}</div>
                    <div class="cell-sub-text">Phone: {{ h.hospitalContactNumber }} | Email: {{ h.officialHospitalEmail }}</div>
                  </td>
                  <td>
                    <div class="cell-main-title">{{ h.registrantName }}</div>
                    <div class="cell-sub-text">{{ h.designation }} ({{ h.employeeId }})</div>
                    <div class="cell-sub-text">Login Email: {{ h.email }}</div>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-xs" (click)="viewCertificate(h.id, h.hospitalName, h.licenseCertificateLink)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>Inspect PDF</span>
                    </button>
                  </td>
                  <td class="text-right">
                    <div class="action-buttons-group">
                      <button 
                        class="btn btn-success btn-sm" 
                        (click)="verifyHospital(h.id, h.hospitalName)" 
                        [disabled]="actionInProgressId === h.id"
                        title="Approve hospital registration and activate login"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Approve & Verify</span>
                      </button>

                      <button 
                        class="btn btn-danger-outline btn-sm" 
                        (click)="rejectHospital(h.id, h.hospitalName)" 
                        [disabled]="actionInProgressId === h.id"
                        title="Reject application"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #emptyPendingHosp>
            <div class="empty-state-panel">
              <div class="empty-icon-box">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h2 class="empty-title">Queue Clear: All Hospitals Verified</h2>
              <p class="empty-desc">No new hospital registration requests currently pending regulatory review.</p>
            </div>
          </ng-template>
        </div>

        <!-- TAB 2: Verified Hospital Registry -->
        <div class="table-card" *ngIf="activeTab === 'verified'">
          <div class="card-top-bar">
            <div class="queue-status">
              <span class="status-indicator status-green"></span>
              <strong>{{ filteredVerifiedHospitals.length }} Verified Medical Establishment{{ filteredVerifiedHospitals.length === 1 ? '' : 's' }}</strong>
            </div>
            <span class="queue-hint">These hospitals have active credentials and access to blood inventory & emergency networks.</span>
          </div>

          <div class="table-responsive" *ngIf="filteredVerifiedHospitals.length > 0; else emptyVerifiedHosp">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Hospital & Facility Info</th>
                  <th>License & ABDM HFR</th>
                  <th>Contact & Location</th>
                  <th>Authorized Registrant</th>
                  <th>Status</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let h of filteredVerifiedHospitals">
                  <td>
                    <div class="cell-main-title">{{ h.hospitalName }}</div>
                    <div class="cell-sub-tag">{{ h.type }}</div>
                  </td>
                  <td>
                    <div class="code-pill"><strong>Lic:</strong> {{ h.licenseNumber }}</div>
                    <div class="code-pill"><strong>HFR:</strong> {{ h.abdmHfrId }}</div>
                  </td>
                  <td>
                    <div class="cell-text">{{ h.address }}</div>
                    <div class="cell-sub-text">Phone: {{ h.hospitalContactNumber }} | Email: {{ h.officialHospitalEmail }}</div>
                  </td>
                  <td>
                    <div class="cell-main-title">{{ h.registrantName }}</div>
                    <div class="cell-sub-text">{{ h.designation }} ({{ h.employeeId }})</div>
                    <div class="cell-sub-text">Login Email: {{ h.email }}</div>
                  </td>
                  <td>
                    <span class="badge-verified">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Verified & Active
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-xs" (click)="viewCertificate(h.id, h.hospitalName, h.licenseCertificateLink)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>View Doc</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #emptyVerifiedHosp>
            <div class="empty-state-panel">
              <div class="empty-icon-box">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 class="empty-title">No Verified Hospitals Found</h2>
              <p class="empty-desc">No hospitals match the search filter or none have been approved yet.</p>
            </div>
          </ng-template>
        </div>

        <!-- TAB 3: Pending Blood Bank Verification Queue (Requirement Part 11) -->
        <div class="table-card" *ngIf="activeTab === 'bb-pending'">
          <div class="card-top-bar">
            <div class="queue-status">
              <span class="status-indicator"></span>
              <strong>{{ filteredPendingBloodBanks.length }} Pending Blood Bank{{ filteredPendingBloodBanks.length === 1 ? '' : 's' }} Awaiting Review</strong>
            </div>
            <span class="queue-hint">Blood Bank facilities cannot sign in until approved by a Health Authority Officer.</span>
          </div>

          <div class="table-responsive" *ngIf="filteredPendingBloodBanks.length > 0; else emptyPendingBB">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Blood Bank & Type</th>
                  <th>Registration No.</th>
                  <th>Address & City</th>
                  <th>Authorized Officer</th>
                  <th>Document</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let bb of filteredPendingBloodBanks">
                  <td>
                    <div class="cell-main-title">{{ bb.bloodBankName }}</div>
                    <div class="cell-sub-tag">{{ bb.bloodBankType }}</div>
                  </td>
                  <td>
                    <div class="code-pill"><strong>Reg:</strong> {{ bb.registrationNumber }}</div>
                    <div class="code-pill" *ngIf="bb.abdmHfrId"><strong>HFR:</strong> {{ bb.abdmHfrId }}</div>
                  </td>
                  <td>
                    <div class="cell-text">{{ bb.address }}</div>
                    <div class="cell-sub-text">{{ bb.city }}, {{ bb.state }} - {{ bb.pinCode }}</div>
                    <div class="cell-sub-text">Contact: {{ bb.contactNumber }} | Email: {{ bb.email }}</div>
                  </td>
                  <td>
                    <div class="cell-main-title">{{ bb.authorizedPersonName || bb.bloodBankName }}</div>
                    <div class="cell-sub-text">{{ bb.designation || 'In-Charge' }}</div>
                    <div class="cell-sub-text" *ngIf="bb.authorizedPersonPhone">Phone: {{ bb.authorizedPersonPhone }}</div>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-xs" *ngIf="bb.registrationCertificate" (click)="viewCertificate(bb.id, bb.bloodBankName, bb.registrationCertificate)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>Inspect PDF</span>
                    </button>
                    <span class="cell-sub-text" *ngIf="!bb.registrationCertificate">Standard Form</span>
                  </td>
                  <td class="text-right">
                    <button 
                      class="btn btn-success btn-sm" 
                      (click)="verifyBloodBank(bb.id, bb.bloodBankName)" 
                      [disabled]="actionInProgressId === bb.id"
                      title="Verify and approve blood bank"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Verify Blood Bank</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #emptyPendingBB>
            <div class="empty-state-panel">
              <div class="empty-icon-box">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h2 class="empty-title">Queue Clear: All Blood Banks Verified</h2>
              <p class="empty-desc">No new blood center registration requests currently pending regulatory review.</p>
            </div>
          </ng-template>
        </div>

        <!-- TAB 4: Verified Blood Bank Registry -->
        <div class="table-card" *ngIf="activeTab === 'bb-verified'">
          <div class="card-top-bar">
            <div class="queue-status">
              <span class="status-indicator status-green"></span>
              <strong>{{ filteredVerifiedBloodBanks.length }} Verified Blood Center{{ filteredVerifiedBloodBanks.length === 1 ? '' : 's' }}</strong>
            </div>
            <span class="queue-hint">These blood centers are actively receiving donor bookings and fulfilling emergency hospital requirements.</span>
          </div>

          <div class="table-responsive" *ngIf="filteredVerifiedBloodBanks.length > 0; else emptyVerifiedBB">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Blood Bank & Type</th>
                  <th>Registration No.</th>
                  <th>Address & City</th>
                  <th>Contact Information</th>
                  <th>Status</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let bb of filteredVerifiedBloodBanks">
                  <td>
                    <div class="cell-main-title">{{ bb.bloodBankName }}</div>
                    <div class="cell-sub-tag">{{ bb.bloodBankType }}</div>
                  </td>
                  <td>
                    <div class="code-pill"><strong>Reg:</strong> {{ bb.registrationNumber }}</div>
                    <div class="code-pill" *ngIf="bb.abdmHfrId"><strong>HFR:</strong> {{ bb.abdmHfrId }}</div>
                  </td>
                  <td>
                    <div class="cell-text">{{ bb.address }}</div>
                    <div class="cell-sub-text">{{ bb.city }}, {{ bb.state }} - {{ bb.pinCode }}</div>
                  </td>
                  <td>
                    <div class="cell-text">Phone: {{ bb.contactNumber }}</div>
                    <div class="cell-sub-text">Email: {{ bb.email }}</div>
                  </td>
                  <td>
                    <span class="badge-verified">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Verified & Active
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-xs" *ngIf="bb.registrationCertificate" (click)="viewCertificate(bb.id, bb.bloodBankName, bb.registrationCertificate)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>View Doc</span>
                    </button>
                    <span class="cell-sub-text" *ngIf="!bb.registrationCertificate">Standard Form</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #emptyVerifiedBB>
            <div class="empty-state-panel">
              <div class="empty-icon-box">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 class="empty-title">No Verified Blood Banks Found</h2>
              <p class="empty-desc">No blood centers match the current search filter.</p>
            </div>
          </ng-template>
        </div>

        <!-- Certificate Inspection Modal -->
        <div class="modal-overlay" *ngIf="inspectCertModal" (click)="closeCertModal()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-title-box">
                <h2 class="modal-title">Statutory License & Accreditation Certificate</h2>
                <p class="modal-desc">{{ currentModalHospitalName }}</p>
              </div>
              <button class="btn-close" (click)="closeCertModal()">&times;</button>
            </div>
            <div class="modal-body">
              <div class="cert-link-box">
                <span class="cert-link-label">Submitted License URI / Certificate Link:</span>
                <div class="cert-url-container">
                  <a [href]="currentCertLink" target="_blank" rel="noopener noreferrer" class="cert-url-link">
                    {{ currentCertLink }}
                  </a>
                </div>
              </div>
              <p class="cert-note">Click the button below to inspect the submitted statutory document in a secure external window.</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeCertModal()">Close</button>
              <a [href]="currentCertLink" target="_blank" rel="noopener noreferrer" class="btn btn-primary" (click)="onCertificateOpen()">
                Open Document in New Tab
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }
    .admin-wrapper {
      flex: 1;
      padding: 2rem 1.5rem;
      background: #f8fafc;
    }
    .admin-container {
      max-width: 1320px;
      margin: 0 auto;
    }
    .badge-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: #0f766e;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      font-size: 0.9375rem;
      color: #64748b;
    }
    .portal-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .tabs-group {
      display: flex;
      background: #e2e8f0;
      padding: 0.25rem;
      border-radius: 12px;
      gap: 0.25rem;
      flex-wrap: wrap;
    }
    .tab-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1.15rem;
      background: transparent;
      border: none;
      border-radius: 9px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s;
    }
    .tab-link:hover:not(.active) {
      color: #0f172a;
      background: rgba(255, 255, 255, 0.5);
    }
    .tab-link.active {
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .tab-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.1rem 0.5rem;
      border-radius: 9999px;
      background: #cbd5e1;
      color: #334155;
    }
    .tab-pill-warn {
      background: #ef4444;
      color: #ffffff;
    }
    .tab-pill-success {
      background: #10b981;
      color: #ffffff;
    }
    .search-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
      min-width: 300px;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      color: #94a3b8;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.55rem 2rem 0.55rem 2.4rem;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 0.875rem;
      background: #ffffff;
      outline: none;
      transition: all 0.15s;
    }
    .search-input:focus {
      border-color: #0f766e;
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
    }
    .btn-clear-search {
      position: absolute;
      right: 0.65rem;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.1rem;
      cursor: pointer;
    }
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
    }
    .card-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      background: #ffffff;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .queue-status {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.9375rem;
      color: #0f172a;
    }
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #f59e0b;
      display: inline-block;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
    }
    .status-indicator.status-green {
      background: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }
    .queue-hint {
      font-size: 0.8125rem;
      color: #64748b;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      text-align: left;
    }
    .data-table th {
      background: #f8fafc;
      padding: 0.85rem 1.25rem;
      font-weight: 700;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .data-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
      color: #334155;
    }
    .data-table tr:hover td {
      background: #fcfdfe;
    }
    .cell-main-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 0.9375rem;
      margin-bottom: 0.15rem;
    }
    .cell-sub-tag {
      display: inline-block;
      font-size: 0.75rem;
      color: #0284c7;
      font-weight: 600;
    }
    .cell-text {
      font-size: 0.8125rem;
      color: #334155;
      max-width: 260px;
      line-height: 1.4;
    }
    .cell-sub-text {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.2rem;
    }
    .code-pill {
      font-family: monospace;
      font-size: 0.75rem;
      background: #f1f5f9;
      color: #0f172a;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      margin-bottom: 0.25rem;
      display: inline-block;
    }
    .code-pill strong {
      color: #64748b;
      font-weight: 600;
    }
    .badge-verified {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 0.3rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .action-buttons-group {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
    .text-right {
      text-align: right;
    }
    .btn {
      padding: 0.55rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.8125rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border: none;
      transition: all 0.15s;
    }
    .btn-xs {
      padding: 0.35rem 0.65rem;
      font-size: 0.75rem;
    }
    .btn-sm {
      padding: 0.45rem 0.85rem;
      font-size: 0.8125rem;
    }
    .btn-primary {
      background: #0f766e;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #0d9488;
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    .btn-success {
      background: #059669;
      color: #ffffff;
    }
    .btn-success:hover:not(:disabled) {
      background: #047857;
    }
    .btn-danger-outline {
      background: #ffffff;
      color: #dc2626;
      border: 1px solid #fca5a5;
    }
    .btn-danger-outline:hover:not(:disabled) {
      background: #fef2f2;
      border-color: #ef4444;
    }
    .btn-outline {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
    }
    .btn-outline:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    .empty-state-panel {
      padding: 4rem 2rem;
      text-align: center;
    }
    .empty-icon-box {
      width: 72px;
      height: 72px;
      background: #f1f5f9;
      color: #94a3b8;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }
    .empty-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }
    .empty-desc {
      font-size: 0.875rem;
      color: #64748b;
      max-width: 420px;
      margin: 0 auto;
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      z-index: 1050;
    }
    .modal-card {
      background: #ffffff;
      border-radius: 16px;
      width: 100%;
      max-width: 580px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .modal-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
    }
    .modal-desc {
      font-size: 0.8125rem;
      color: #64748b;
      margin-top: 0.15rem;
    }
    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      color: #94a3b8;
      cursor: pointer;
      line-height: 1;
    }
    .btn-close:hover {
      color: #0f172a;
    }
    .modal-body {
      padding: 1.5rem;
    }
    .cert-link-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .cert-link-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      display: block;
      margin-bottom: 0.35rem;
    }
    .cert-url-link {
      color: #0284c7;
      font-size: 0.875rem;
      word-break: break-all;
      text-decoration: underline;
    }
    .cert-note {
      font-size: 0.8125rem;
      color: #64748b;
    }
    .modal-footer {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `]
})
export class AdminVerifyComponent implements OnInit {
  private authService = inject(HospitalAuthService);
  private toastService = inject(ToastService);
  private http = inject(HttpClient);

  activeTab: 'pending' | 'verified' | 'bb-pending' | 'bb-verified' = 'pending';
  
  pendingHospitals: Hospital[] = [];
  verifiedHospitals: Hospital[] = [];
  
  pendingBloodBanks: BloodBankItem[] = [];
  verifiedBloodBanks: BloodBankItem[] = [];

  searchQuery = '';
  isLoading = false;
  actionInProgressId: number | null = null;

  inspectCertModal = false;
  currentCertLink = '';
  currentModalHospitalName = '';

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadPendingHospitals();
    this.loadVerifiedHospitals();
    this.loadBloodBanks();
  }

  refreshCurrentTab(): void {
    if (this.activeTab === 'pending') {
      this.loadPendingHospitals();
    } else if (this.activeTab === 'verified') {
      this.loadVerifiedHospitals();
    } else {
      this.loadBloodBanks();
    }
  }

  switchTab(tab: 'pending' | 'verified' | 'bb-pending' | 'bb-verified'): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.refreshCurrentTab();
  }

  loadPendingHospitals(): void {
    this.isLoading = true;
    this.authService.getPendingHospitals().subscribe({
      next: (data: Hospital[]) => {
        this.isLoading = false;
        this.pendingHospitals = data || [];
      },
      error: (err) => {
        this.isLoading = false;
        this.pendingHospitals = [];
        if (err.status === 401 || err.status === 403) {
          this.toastService.error('Admin session unauthorized or expired. Please sign in as Health Authority Admin.', 'Access Denied');
        } else {
          this.toastService.error('Failed to retrieve pending hospital applications.', 'Sync Error');
        }
      }
    });
  }

  loadVerifiedHospitals(): void {
    this.isLoading = true;
    this.authService.getVerifiedHospitals().subscribe({
      next: (data: Hospital[]) => {
        this.isLoading = false;
        this.verifiedHospitals = data || [];
      },
      error: (err) => {
        this.isLoading = false;
        this.verifiedHospitals = [];
        if (err.status === 401 || err.status === 403) {
          this.toastService.error('Admin session unauthorized or expired. Please sign in as Health Authority Admin.', 'Access Denied');
        } else {
          this.toastService.error('Failed to retrieve verified hospital registry.', 'Sync Error');
        }
      }
    });
  }

  loadBloodBanks(): void {
    this.isLoading = true;
    this.http.get<BloodBankItem[]>(`${environment.apiUrl}/bloodbanks`).subscribe({
      next: (data: BloodBankItem[]) => {
        this.isLoading = false;
        const all = data || [];
        this.pendingBloodBanks = all.filter(bb => !bb.isVerified);
        this.verifiedBloodBanks = all.filter(bb => bb.isVerified);
      },
      error: (err) => {
        this.isLoading = false;
        this.pendingBloodBanks = [];
        this.verifiedBloodBanks = [];
        if (err.status === 401 || err.status === 403) {
          this.toastService.error('Admin session unauthorized or expired. Please sign in as Health Authority Admin.', 'Access Denied');
        } else {
          this.toastService.error('Failed to retrieve blood bank registry.', 'Sync Error');
        }
      }
    });
  }

  get filteredPendingHospitals(): Hospital[] {
    if (!this.searchQuery.trim()) return this.pendingHospitals;
    const q = this.searchQuery.toLowerCase();
    return this.pendingHospitals.filter(h =>
      h.hospitalName.toLowerCase().includes(q) ||
      h.licenseNumber.toLowerCase().includes(q) ||
      h.abdmHfrId.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q)
    );
  }

  get filteredVerifiedHospitals(): Hospital[] {
    if (!this.searchQuery.trim()) return this.verifiedHospitals;
    const q = this.searchQuery.toLowerCase();
    return this.verifiedHospitals.filter(h =>
      h.hospitalName.toLowerCase().includes(q) ||
      h.licenseNumber.toLowerCase().includes(q) ||
      h.abdmHfrId.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q)
    );
  }

  get filteredPendingBloodBanks(): BloodBankItem[] {
    if (!this.searchQuery.trim()) return this.pendingBloodBanks;
    const q = this.searchQuery.toLowerCase();
    return this.pendingBloodBanks.filter(bb =>
      bb.bloodBankName.toLowerCase().includes(q) ||
      bb.registrationNumber.toLowerCase().includes(q) ||
      (bb.city && bb.city.toLowerCase().includes(q)) ||
      (bb.address && bb.address.toLowerCase().includes(q))
    );
  }

  get filteredVerifiedBloodBanks(): BloodBankItem[] {
    if (!this.searchQuery.trim()) return this.verifiedBloodBanks;
    const q = this.searchQuery.toLowerCase();
    return this.verifiedBloodBanks.filter(bb =>
      bb.bloodBankName.toLowerCase().includes(q) ||
      bb.registrationNumber.toLowerCase().includes(q) ||
      (bb.city && bb.city.toLowerCase().includes(q)) ||
      (bb.address && bb.address.toLowerCase().includes(q))
    );
  }

  viewCertificate(id: number, name: string, directLink?: string): void {
    this.currentModalHospitalName = name;
    if (directLink) {
      this.currentCertLink = directLink;
      this.inspectCertModal = true;
      this.toastService.info(`Inspecting certificate for ${name}`, 'Document Ready');
      return;
    }

    this.authService.getCertificate(id).subscribe({
      next: (res: CertificateResponse) => {
        this.currentCertLink = res.link;
        this.inspectCertModal = true;
        this.toastService.info(`Inspecting certificate for ${name}`, 'Document Ready');
      },
      error: () => {
        this.toastService.error(`Could not retrieve document for ${name}`, 'Document Error');
      }
    });
  }

  onCertificateOpen(): void {
    this.toastService.info('Opened statutory license in external viewer.', 'Document Inspection');
  }

  closeCertModal(): void {
    this.inspectCertModal = false;
    this.currentCertLink = '';
  }

  verifyHospital(hospitalId: number, name: string): void {
    this.actionInProgressId = hospitalId;
    this.authService.verifyHospital(hospitalId).subscribe({
      next: () => {
        this.actionInProgressId = null;
        this.toastService.success(
          `Hospital "${name}" has been approved & accredited! Login is now activated.`,
          'Accreditation Approved'
        );
        this.pendingHospitals = this.pendingHospitals.filter(h => h.id !== hospitalId);
        this.loadVerifiedHospitals();
      },
      error: (err: any) => {
        this.actionInProgressId = null;
        const msg = err.error?.message || err.error || 'Failed to verify hospital.';
        this.toastService.error(typeof msg === 'string' ? msg : 'Verification Error', 'Action Failed');
      }
    });
  }

  rejectHospital(hospitalId: number, name: string): void {
    if (!confirm(`Are you sure you want to reject and remove registration application for "${name}"?`)) {
      return;
    }

    this.actionInProgressId = hospitalId;
    this.authService.rejectHospital(hospitalId).subscribe({
      next: () => {
        this.actionInProgressId = null;
        this.toastService.warning(
          `Application for "${name}" has been rejected and deleted from the registry.`,
          'Application Rejected'
        );
        this.pendingHospitals = this.pendingHospitals.filter(h => h.id !== hospitalId);
      },
      error: (err: any) => {
        this.actionInProgressId = null;
        const msg = err.error?.message || err.error || 'Failed to reject hospital.';
        this.toastService.error(typeof msg === 'string' ? msg : 'Rejection Error', 'Action Failed');
      }
    });
  }

  verifyBloodBank(bbId: number, name: string): void {
    this.actionInProgressId = bbId;
    this.http.put(`${environment.apiUrl}/bloodbanks/verify/${bbId}`, {}).subscribe({
      next: () => {
        this.actionInProgressId = null;
        this.toastService.success(
          `Blood Bank "${name}" has been verified & approved! Login is now activated.`,
          'Accreditation Approved'
        );
        this.loadBloodBanks();
      },
      error: (err: any) => {
        this.actionInProgressId = null;
        const msg = err.error?.message || err.error || 'Failed to verify blood bank.';
        this.toastService.error(typeof msg === 'string' ? msg : 'Verification Error', 'Action Failed');
      }
    });
  }
}
