import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HospitalBloodRequestService } from '../../../core/services/hospital-request.service';
import { HospitalAuthService } from '../../../core/services/hospital-auth.service';
import { BloodRequest, BloodRequestDto } from '../../../core/models/hospital-request.model';
import { BloodBankSearchResult } from '../../../core/models/hospital-search.model';
import { HOSPITAL_BLOOD_GROUPS } from '../../../core/models/hospital-inventory.model';
import { ToastService } from '../../../core/services/toast.service';
import { HospitalNavbarComponent } from '../../../shared/components/hospital-navbar/hospital-navbar.component';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-hospital-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HospitalNavbarComponent, AppFooterComponent],
  template: `
    <div class="page-layout">
      <app-hospital-navbar></app-hospital-navbar>
      <main class="requests-wrapper">
        <div class="requests-container">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <div class="badge-tag">Hospital Emergency Outbound Console</div>
            <h1 class="page-title">Dispatched Blood Requirements</h1>
            <p class="page-subtitle">Track the live approval and dispatch status of emergency requirements sent to regional blood banks.</p>
          </div>
          <button class="btn btn-emergency-dispatch" (click)="openDispatchModal()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Raise Emergency Blood Request</span>
          </button>
        </div>

        <!-- Filter & Feed Controls -->
        <div class="feed-controls-bar">
          <div class="feed-tabs">
            <button class="tab-btn active">
              My Dispatched Requests
              <span class="tab-badge">{{ requests.length }}</span>
            </button>
          </div>

          <button class="btn btn-secondary btn-sm" (click)="loadRequests(true)" [disabled]="isLoading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.spin]="isLoading">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 21h5v-5"></path>
            </svg>
            <span>Refresh Status</span>
          </button>
        </div>

        <!-- Outbound Dispatched Requests Grid -->
        <div class="requests-grid" *ngIf="requests.length > 0; else emptyState">
          <div *ngFor="let req of requests" class="request-card">
            <!-- Card Header -->
            <div class="req-card-top">
              <div class="blood-req-badge">
                <span class="group-label">{{ req.bloodGroup }}</span>
                <span class="units-badge">{{ req.numberOfUnits }} Unit{{ req.numberOfUnits === 1 ? '' : 's' }}</span>
              </div>
              
              <!-- Status Pill -->
              <div class="status-pill" [ngClass]="getStatusClass(req.status)">
                <span class="dot"></span>
                <span>{{ getStatusLabel(req.status) }}</span>
              </div>
            </div>

            <!-- Card Body: Target Blood Bank Details -->
            <div class="req-card-body">
              <div class="destination-box">
                <span class="dest-label">Target Facility</span>
                <h2 class="destination-name">{{ req.bloodBank?.bloodBankName || 'Regional Blood Center' }}</h2>
                <div class="dest-meta" *ngIf="req.bloodBank?.address">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{{ req.bloodBank?.address }}{{ req.bloodBank?.city ? ', ' + req.bloodBank?.city : '' }}</span>
                </div>
                <div class="dest-meta" *ngIf="req.bloodBank?.contactNumber">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{{ req.bloodBank?.contactNumber }}</span>
                </div>
              </div>

              <div class="req-timing-info">
                <div class="timing-item">
                  <span class="timing-label">Required By:</span>
                  <strong>{{ req.dateOfRequirement }}</strong>
                </div>
                <div class="timing-item" *ngIf="req.id">
                  <span class="timing-label">Request ID:</span>
                  <code>#REQ-{{ req.id }}</code>
                </div>
              </div>

              <!-- Status Explanatory Note -->
              <div class="status-note" [ngClass]="getStatusNoteClass(req.status)">
                <span *ngIf="req.status === 'APPROVED'">
                  🎉 <strong>Approved by Blood Bank</strong> — Required units have been confirmed and reserved for your medical facility.
                </span>
                <span *ngIf="req.status === 'REJECTED'">
                  ⚠️ <strong>Request Declined</strong> — Blood bank could not fulfill this requirement. Please dispatch to an alternate facility.
                </span>
                <span *ngIf="!req.status || req.status === 'PENDING'">
                  ⏳ <strong>Pending Blood Bank Review</strong> — Blood bank has received your notification and is preparing authorization.
                </span>
              </div>

              <!-- Hospital Request -> Blood Bank Response -> Donor Response Tracking (Requirement 6) -->
              <div class="donor-tracking-box" *ngIf="getDonorsForRequest(req.id).length > 0">
                <div class="tracking-title-row">
                  <span class="tracking-title">🤝 Donor Response Tracking</span>
                  <span class="tracking-count">{{ getDonorsForRequest(req.id).length }} Notified</span>
                </div>
                <div class="donor-chips-list">
                  <div *ngFor="let donor of getDonorsForRequest(req.id)" class="donor-chip" [ngClass]="donor.status === 'ACCEPTED' ? 'donor-accepted' : donor.status === 'REJECTED' ? 'donor-rejected' : 'donor-pending'">
                    <div class="donor-chip-main">
                      <span class="donor-name">👤 {{ donor.donorName || 'Voluntary Donor' }} ({{ donor.bloodGroup }})</span>
                      <span *ngIf="donor.contactNumber" class="donor-phone">📞 {{ donor.contactNumber }}</span>
                    </div>
                    <span class="donor-status-tag">{{ donor.status }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #emptyState>
          <div class="empty-feed-card">
            <div class="empty-icon-circle">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <h2 class="empty-feed-title">No Emergency Outbound Requests Dispatched</h2>
            <p class="empty-feed-subtitle">Your hospital hasn't raised any active emergency blood requests yet. When urgent blood units are required, search regional blood bank stock and dispatch directly.</p>
            <button class="btn btn-emergency-dispatch" (click)="openDispatchModal()">
              <span>Create Emergency Requirement Request</span>
            </button>
          </div>
        </ng-template>

        <!-- Multi-Step Emergency Dispatch Modal with Live Blood Bank Search & Selection -->
        <div class="modal-overlay" *ngIf="showModal" (click)="closeDispatchModal()">
          <div class="modal-card modal-lg" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <h2 class="modal-title">Emergency Blood Dispatch Console</h2>
                <p class="modal-subtitle">Check regional blood bank availability and dispatch requirements to selected facilities.</p>
              </div>
              <button class="btn-close" (click)="closeDispatchModal()">&times;</button>
            </div>

            <!-- Stepper Progress Indicator -->
            <div class="modal-stepper">
              <div class="step-item" [class.step-active]="modalStep === 1" [class.step-done]="modalStep === 2">
                <span class="step-circle">1</span>
                <span class="step-label">Specify Requirement</span>
              </div>
              <div class="step-line" [class.step-line-active]="modalStep === 2"></div>
              <div class="step-item" [class.step-active]="modalStep === 2">
                <span class="step-circle">2</span>
                <span class="step-label">Select Available Blood Bank</span>
              </div>
            </div>

            <!-- STEP 1: Requirement Input -->
            <div *ngIf="modalStep === 1" class="modal-step-body">
              <form [formGroup]="requestForm" class="modal-form">
                <div class="modal-body">
                  <div class="form-group">
                    <label class="form-label">Blood Group Needed <span class="req">*</span></label>
                    <select formControlName="bloodGroup" class="form-control form-control-lg" [class.is-invalid]="f['bloodGroup'].touched && f['bloodGroup'].invalid">
                      <option value="" disabled>Select blood group</option>
                      <option *ngFor="let bg of bloodGroups" [value]="bg">{{ bg }} Blood</option>
                    </select>
                    <div class="form-error" *ngIf="f['bloodGroup'].touched && f['bloodGroup'].invalid">Blood group selection is required</div>
                  </div>

                  <div class="form-row-2">
                    <div class="form-group">
                      <label class="form-label">Units Required (Bags) <span class="req">*</span></label>
                      <input type="number" min="1" max="50" formControlName="numberOfUnits" class="form-control" [class.is-invalid]="f['numberOfUnits'].touched && f['numberOfUnits'].invalid" />
                      <div class="form-error" *ngIf="f['numberOfUnits'].touched && f['numberOfUnits'].invalid">Minimum 1 unit required</div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Required By Date <span class="req">*</span></label>
                      <input type="date" formControlName="dateOfRequirement" class="form-control" [class.is-invalid]="f['dateOfRequirement'].touched && f['dateOfRequirement'].invalid" />
                      <div class="form-error" *ngIf="f['dateOfRequirement'].touched && f['dateOfRequirement'].invalid">Date is required</div>
                    </div>
                  </div>

                  <div class="info-callout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Click below to query live inventory across regional blood banks within range of your hospital.</span>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" (click)="closeDispatchModal()">Cancel</button>
                  <button type="button" class="btn btn-primary btn-lg" (click)="searchAndProceedToStep2()" [disabled]="requestForm.invalid || isSearchingBB">
                    <span *ngIf="!isSearchingBB">🔍 Search Available Blood Banks &rarr;</span>
                    <span *ngIf="isSearchingBB">Searching Regional Stock...</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- STEP 2: Live Blood Bank Availability List & Selection -->
            <div *ngIf="modalStep === 2" class="modal-step-body">
              <div class="modal-body">
                <!-- Summary Pill of Requirement -->
                <div class="req-summary-card">
                  <div class="req-sum-left">
                    <span class="req-sum-badge">{{ requestForm.get('bloodGroup')?.value }}</span>
                    <div>
                      <strong class="req-sum-units">{{ requestForm.get('numberOfUnits')?.value }} Unit{{ requestForm.get('numberOfUnits')?.value === 1 ? '' : 's' }} Required</strong>
                      <span class="req-sum-date">Needed by: {{ requestForm.get('dateOfRequirement')?.value }}</span>
                    </div>
                  </div>
                  <button type="button" class="btn-change-req" (click)="modalStep = 1">
                    ✏️ Change Requirement
                  </button>
                </div>

                <!-- Blood Banks Search Results -->
                <div class="bb-list-header">
                  <h3 class="bb-list-title">Regional Blood Banks with {{ requestForm.get('bloodGroup')?.value }} Available</h3>
                  <span class="bb-list-count" *ngIf="searchResults.length > 0">{{ searchResults.length }} Facility(ies) Found</span>
                </div>

                <!-- Available Blood Banks Grid -->
                <div class="bb-results-grid" *ngIf="searchResults.length > 0; else noBBMatch">
                  <div 
                    *ngFor="let bb of searchResults; let i = index" 
                    class="bb-select-card" 
                    [class.bb-selected]="selectedBloodBank?.bloodBankId === bb.bloodBankId"
                    (click)="selectBloodBank(bb)"
                  >
                    <div class="bb-card-radio">
                      <div class="custom-radio-circle" [class.radio-checked]="selectedBloodBank?.bloodBankId === bb.bloodBankId">
                        <div class="radio-dot" *ngIf="selectedBloodBank?.bloodBankId === bb.bloodBankId"></div>
                      </div>
                    </div>

                    <div class="bb-card-info">
                      <div class="bb-card-top-row">
                        <div>
                          <span class="nearest-badge" *ngIf="i === 0">🏆 Closest Facility</span>
                          <h4 class="bb-card-name">{{ bb.bloodBankName }}</h4>
                        </div>
                        <span class="bb-dist-badge">
                          📍 {{ bb.distanceKm | number:'1.1-1' }} km away
                        </span>
                      </div>

                      <div class="bb-meta-details-row" *ngIf="bb.address || bb.contactNumber">
                        <span *ngIf="bb.address" class="bb-addr">🏢 {{ bb.address }}{{ bb.city ? ', ' + bb.city : '' }}</span>
                        <span *ngIf="bb.contactNumber" class="bb-phone">📞 {{ bb.contactNumber }}</span>
                      </div>

                      <div class="bb-card-stock-row">
                        <div class="stock-pill" [class.stock-sufficient]="bb.availableUnits >= requestForm.get('numberOfUnits')?.value">
                          <span class="stock-num">{{ bb.availableUnits }}</span> units in stock
                        </div>
                        <span class="avail-status-tag" *ngIf="bb.availableUnits >= requestForm.get('numberOfUnits')?.value">
                          ✅ Stock Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No Matching Blood Banks Fallback -->
                <ng-template #noBBMatch>
                  <div class="no-bb-card">
                    <div class="no-bb-icon">⚠️</div>
                    <h4 class="no-bb-title">No Blood Banks Currently Have {{ requestForm.get('numberOfUnits')?.value }} Units of {{ requestForm.get('bloodGroup')?.value }}</h4>
                    <p class="no-bb-desc">No regional blood banks reported sufficient stock matching this exact quantity. You can search all nearest blood banks or broadcast a general requirement.</p>
                    <div class="no-bb-actions">
                      <button type="button" class="btn btn-secondary btn-sm" (click)="loadNearestBloodBanks()" [disabled]="isSearchingBB">
                        <span>🔍 Search Nearest Registered Blood Banks</span>
                      </button>
                    </div>
                  </div>
                </ng-template>

                <!-- Selected Blood Bank Confirmation Banner -->
                <div class="selected-confirmation-banner" *ngIf="selectedBloodBank">
                  <div class="selected-icon">🎯</div>
                  <div class="selected-text">
                    <strong>Target Destination: {{ selectedBloodBank.bloodBankName }}</strong>
                    <p>Emergency request for {{ requestForm.get('numberOfUnits')?.value }} unit(s) of {{ requestForm.get('bloodGroup')?.value }} will be delivered directly to this facility.</p>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="modalStep = 1">&larr; Back to Step 1</button>
                <button 
                  type="button" 
                  class="btn btn-emergency-dispatch btn-lg" 
                  (click)="submitTargetedRequest()" 
                  [disabled]="isSubmitting || !selectedBloodBank"
                >
                  <span *ngIf="!isSubmitting">
                    🚀 Dispatch Request to {{ selectedBloodBank ? selectedBloodBank.bloodBankName : 'Selected Bank' }}
                  </span>
                  <span *ngIf="isSubmitting">Dispatching Emergency Request...</span>
                </button>
              </div>
            </div>
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
    .requests-wrapper {
      flex: 1;
      padding: 2rem 1.5rem;
      background: #f8fafc;
    }
    .requests-container {
      max-width: 1250px;
      margin: 0 auto;
    }
    .badge-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: #dc2626;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
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
    .btn-emergency-dispatch {
      background: #dc2626;
      color: #ffffff;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9375rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
      transition: all 0.2s;
    }
    .btn-emergency-dispatch:hover:not(:disabled) {
      background: #b91c1c;
      transform: translateY(-1px);
    }
    .btn-emergency-dispatch:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .feed-controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .tab-btn {
      background: transparent;
      border: none;
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
      border-bottom: 2px solid #dc2626;
    }
    .tab-badge {
      background: #fee2e2;
      color: #dc2626;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .requests-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .request-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
      transition: all 0.2s;
    }
    .request-card:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    }
    .req-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .blood-req-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .group-label {
      background: #fee2e2;
      color: #dc2626;
      font-weight: 800;
      font-size: 1.15rem;
      padding: 0.35rem 0.65rem;
      border-radius: 8px;
    }
    .units-badge {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #0f172a;
    }
    .status-pill {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
    }
    .status-pending {
      background: #fef3c7;
      border: 1px solid #fde68a;
      color: #b45309;
    }
    .status-approved {
      background: #dcfce7;
      border: 1px solid #bbf7d0;
      color: #15803d;
    }
    .status-rejected {
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #b91c1c;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    .destination-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 0.875rem;
    }
    .dest-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      display: block;
      margin-bottom: 0.25rem;
    }
    .destination-name {
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.35rem;
    }
    .dest-meta {
      font-size: 0.8125rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-top: 0.25rem;
    }
    .dest-meta svg {
      color: #94a3b8;
      flex-shrink: 0;
    }
    .req-timing-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
      color: #475569;
      padding: 0.5rem 0.25rem;
      border-bottom: 1px dashed #e2e8f0;
      margin-bottom: 0.75rem;
    }
    .timing-item code {
      background: #f1f5f9;
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .status-note {
      font-size: 0.8125rem;
      padding: 0.65rem 0.875rem;
      border-radius: 8px;
      line-height: 1.4;
    }
    .note-pending {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fef3c7;
    }
    .note-approved {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #dcfce7;
    }
    .note-rejected {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fee2e2;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
      transition: all 0.15s;
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #e2e8f0;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    .btn-sm {
      padding: 0.35rem 0.75rem;
      font-size: 0.8125rem;
    }
    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 0.9375rem;
      border-radius: 10px;
    }
    .empty-feed-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .empty-icon-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f0fdf4;
      color: #16a34a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .empty-feed-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
    }
    .empty-feed-subtitle {
      font-size: 0.9375rem;
      color: #64748b;
      max-width: 480px;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1rem;
      backdrop-filter: blur(4px);
    }
    .modal-card {
      background: #ffffff;
      border-radius: 18px;
      max-width: 600px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .modal-lg {
      max-width: 680px;
    }
    .modal-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #e2e8f0;
    }
    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.2rem;
    }
    .modal-subtitle {
      font-size: 0.8125rem;
      color: #64748b;
    }
    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      color: #94a3b8;
      cursor: pointer;
    }
    .modal-stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.875rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      gap: 1rem;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #94a3b8;
    }
    .step-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .step-item.step-active .step-circle {
      background: #dc2626;
      color: #ffffff;
    }
    .step-item.step-active {
      color: #0f172a;
    }
    .step-item.step-done .step-circle {
      background: #10b981;
      color: #ffffff;
    }
    .step-line {
      flex: 1;
      height: 2px;
      background: #e2e8f0;
      max-width: 60px;
    }
    .step-line.step-line-active {
      background: #10b981;
    }
    .modal-step-body {
      display: flex;
      flex-direction: column;
    }
    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      max-height: 60vh;
      overflow-y: auto;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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
    }
    .form-control-lg {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      font-weight: 600;
    }
    .req { color: #ef4444; }
    .form-error { font-size: 0.75rem; color: #ef4444; }
    .info-callout {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 10px;
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
      color: #0369a1;
      display: flex;
      gap: 0.65rem;
    }
    .info-callout svg {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }
    .req-summary-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.875rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .req-sum-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .req-sum-badge {
      background: #fee2e2;
      color: #dc2626;
      font-weight: 800;
      font-size: 1.15rem;
      padding: 0.35rem 0.65rem;
      border-radius: 8px;
    }
    .req-sum-units {
      display: block;
      color: #0f172a;
      font-size: 0.9375rem;
    }
    .req-sum-date {
      font-size: 0.75rem;
      color: #64748b;
    }
    .btn-change-req {
      background: transparent;
      border: none;
      color: #0284c7;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
    }
    .bb-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
    }
    .bb-list-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #0f172a;
    }
    .bb-list-count {
      font-size: 0.75rem;
      font-weight: 700;
      color: #15803d;
      background: #dcfce7;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
    }
    .bb-results-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .bb-select-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .bb-select-card:hover {
      border-color: #fca5a5;
      background: #fffafa;
      transform: translateY(-1px);
    }
    .bb-select-card.bb-selected {
      border-color: #dc2626;
      background: #fff5f5;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
    }
    .custom-radio-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .custom-radio-circle.radio-checked {
      border-color: #dc2626;
      background: #ffffff;
    }
    .radio-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #dc2626;
    }
    .bb-card-info {
      flex: 1;
    }
    .bb-card-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }
    .bb-card-name {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #0f172a;
    }
    .bb-dist-badge {
      font-size: 0.75rem;
      color: #0284c7;
      font-weight: 600;
      background: #f0f9ff;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
    }
    .nearest-badge {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 800;
      color: #15803d;
      background: #dcfce7;
      border: 1px solid #bbf7d0;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      margin-bottom: 0.2rem;
      text-transform: uppercase;
    }
    .bb-meta-details-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: #64748b;
      margin: 0.25rem 0 0.5rem;
    }
    .bb-addr, .bb-phone {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
    .bb-card-stock-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .donor-tracking-box {
      margin-top: 1rem;
      padding-top: 0.85rem;
      border-top: 1px dashed #cbd5e1;
    }
    .tracking-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .tracking-title {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #334155;
    }
    .tracking-count {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .donor-chips-list {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .donor-chip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.45rem 0.65rem;
      border-radius: 8px;
      font-size: 0.8125rem;
      border: 1px solid #e2e8f0;
    }
    .donor-chip-main {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .donor-name {
      font-weight: 600;
      color: #1e293b;
    }
    .donor-phone {
      font-size: 0.75rem;
      color: #64748b;
      font-family: monospace;
      font-weight: 600;
    }
    .donor-status-tag {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
    .donor-pending {
      background: #fffbeb;
      border-color: #fde68a;
    }
    .donor-pending .donor-status-tag {
      background: #fef3c7;
      color: #d97706;
    }
    .donor-accepted {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }
    .donor-accepted .donor-status-tag {
      background: #dcfce7;
      color: #16a34a;
    }
    .donor-rejected {
      background: #fef2f2;
      border-color: #fecaca;
    }
    .donor-rejected .donor-status-tag {
      background: #fee2e2;
      color: #dc2626;
    }
    .stock-pill {
      font-size: 0.8125rem;
      color: #475569;
    }
    .stock-num {
      font-weight: 800;
      color: #dc2626;
    }
    .stock-sufficient .stock-num {
      color: #15803d;
    }
    .avail-status-tag {
      font-size: 0.75rem;
      color: #15803d;
      font-weight: 600;
    }
    .no-bb-card {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }
    .no-bb-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .no-bb-title {
      font-size: 1rem;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 0.35rem;
    }
    .no-bb-desc {
      font-size: 0.8125rem;
      color: #b45309;
      margin-bottom: 1rem;
      line-height: 1.4;
    }
    .selected-confirmation-banner {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 12px;
      padding: 0.875rem 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .selected-icon {
      font-size: 1.25rem;
    }
    .selected-text {
      font-size: 0.8125rem;
      color: #166534;
      line-height: 1.4;
    }
    .selected-text strong {
      display: block;
      font-size: 0.875rem;
      color: #14532d;
      margin-bottom: 0.15rem;
    }
    .selected-text p {
      margin: 0;
    }
    .modal-footer {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
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
    @media (max-width: 1050px) {
      .requests-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 700px) {
      .requests-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HospitalRequestsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bloodRequestService = inject(HospitalBloodRequestService);
  private authService = inject(HospitalAuthService);
  private toastService = inject(ToastService);

  bloodGroups: string[] = HOSPITAL_BLOOD_GROUPS;
  requests: BloodRequest[] = [];
  isLoading = false;
  showModal = false;
  modalStep = 1;
  isSubmitting = false;
  isSearchingBB = false;

  searchResults: BloodBankSearchResult[] = [];
  selectedBloodBank: BloodBankSearchResult | null = null;
  donorRequestsList: any[] = [];

  hospitalLatitude = 19.0760;
  hospitalLongitude = 72.8777;

  requestForm: FormGroup = this.fb.group({
    bloodGroup: ['', [Validators.required]],
    numberOfUnits: [2, [Validators.required, Validators.min(1)]],
    dateOfRequirement: [this.getDefaultDate(), [Validators.required]]
  });

  get f() {
    return this.requestForm.controls;
  }

  ngOnInit(): void {
    this.loadHospitalCoordinates();
    this.loadRequests();
  }

  loadHospitalCoordinates(): void {
    this.authService.getCurrentProfile().subscribe({
      next: (profile: any) => {
        if (profile?.latitude && profile?.longitude) {
          this.hospitalLatitude = profile.latitude;
          this.hospitalLongitude = profile.longitude;
        }
      },
      error: () => {}
    });
  }

  getDefaultDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  loadRequests(isManualRefresh = false): void {
    this.isLoading = true;
    this.bloodRequestService.getMyHospitalRequests().subscribe({
      next: (data: BloodRequest[]) => {
        this.isLoading = false;
        this.requests = data || [];
        if (isManualRefresh) {
          this.toastService.info('Emergency requirement status updated.', 'Status Refreshed');
        }
      },
      error: () => {
        this.isLoading = false;
        this.requests = [];
        this.toastService.error('Failed to load emergency blood requests.', 'Network Error');
      }
    });

    this.bloodRequestService.getHospitalDonationRequests().subscribe({
      next: (donors: any[]) => {
        this.donorRequestsList = donors || [];
      },
      error: () => {
        this.donorRequestsList = [];
      }
    });
  }

  getDonorsForRequest(requestId?: number): any[] {
    if (!requestId) return [];
    return this.donorRequestsList.filter(d => d.bloodRequestId === requestId);
  }

  openDispatchModal(): void {
    this.requestForm.reset({
      bloodGroup: '',
      numberOfUnits: 2,
      dateOfRequirement: this.getDefaultDate()
    });
    this.searchResults = [];
    this.selectedBloodBank = null;
    this.modalStep = 1;
    this.showModal = true;
  }

  closeDispatchModal(): void {
    this.showModal = false;
    this.searchResults = [];
    this.selectedBloodBank = null;
    this.modalStep = 1;
  }

  searchAndProceedToStep2(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.toastService.warning('Please select blood group, quantity and required date.', 'Incomplete Form');
      return;
    }

    const form = this.requestForm.value;
    this.isSearchingBB = true;
    this.selectedBloodBank = null;

    this.bloodRequestService.searchBloodBanks(
      form.bloodGroup,
      form.numberOfUnits || 1,
      this.hospitalLatitude,
      this.hospitalLongitude
    ).subscribe({
      next: (data: BloodBankSearchResult[]) => {
        this.isSearchingBB = false;
        this.searchResults = data;
        this.modalStep = 2;

        if (data.length > 0) {
          this.selectedBloodBank = data[0];
          this.toastService.info(
            `Found ${data.length} blood bank(s) with available stock. Selected nearest: ${data[0].bloodBankName}`,
            'Stock Available'
          );
        } else {
          this.toastService.warning(
            `No regional blood banks currently hold >= ${form.numberOfUnits} units of ${form.bloodGroup}.`,
            'Shortage in Region'
          );
        }
      },
      error: () => {
        this.isSearchingBB = false;
        this.toastService.error('Could not query regional blood bank availability.', 'Search Error');
      }
    });
  }

  loadNearestBloodBanks(): void {
    this.isSearchingBB = true;
    this.bloodRequestService.searchNearestBloodBanks(
      this.hospitalLatitude,
      this.hospitalLongitude
    ).subscribe({
      next: (data: BloodBankSearchResult[]) => {
        this.isSearchingBB = false;
        this.searchResults = data;
        if (data.length > 0) {
          this.selectedBloodBank = data[0];
          this.toastService.info(`Loaded ${data.length} registered blood banks in your vicinity.`, 'Nearby Facilities');
        } else {
          this.toastService.warning('No blood bank facilities found in regional registry.', 'Empty Registry');
        }
      },
      error: () => {
        this.isSearchingBB = false;
        this.toastService.error('Failed to load registered blood banks.', 'Search Error');
      }
    });
  }

  selectBloodBank(bb: BloodBankSearchResult): void {
    this.selectedBloodBank = bb;
    this.toastService.info(`Target destination set to: ${bb.bloodBankName}`, 'Facility Selected');
  }

  submitTargetedRequest(): void {
    if (this.requestForm.invalid || !this.selectedBloodBank) {
      this.toastService.warning('Please select a target blood bank to dispatch this emergency request.', 'Selection Required');
      return;
    }

    this.isSubmitting = true;
    const form = this.requestForm.value;
    const dto: BloodRequestDto = {
      bloodGroup: form.bloodGroup,
      numberOfUnits: form.numberOfUnits,
      dateOfRequirement: form.dateOfRequirement,
      bloodBankId: this.selectedBloodBank.bloodBankId
    };

    const targetBankName = this.selectedBloodBank.bloodBankName;

    this.bloodRequestService.raiseRequest(dto).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeDispatchModal();
        this.toastService.success(
          `Emergency request for ${dto.numberOfUnits} unit(s) of ${dto.bloodGroup} sent directly to ${targetBankName}!`,
          'Dispatch Dispatched'
        );
        this.loadRequests();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const msg = err.error?.message || err.error || 'Failed to dispatch request.';
        this.toastService.error(typeof msg === 'string' ? msg : 'Dispatch Error', 'Action Failed');
      }
    });
  }

  getStatusLabel(status?: string): string {
    if (status === 'APPROVED') return 'Approved & Dispatched';
    if (status === 'REJECTED') return 'Declined by Bank';
    return 'Pending Bank Review';
  }

  getStatusClass(status?: string): string {
    if (status === 'APPROVED') return 'status-approved';
    if (status === 'REJECTED') return 'status-rejected';
    return 'status-pending';
  }

  getStatusNoteClass(status?: string): string {
    if (status === 'APPROVED') return 'note-approved';
    if (status === 'REJECTED') return 'note-rejected';
    return 'note-pending';
  }
}
