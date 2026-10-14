import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospitalInventoryService } from '../../../core/services/hospital-inventory.service';
import { BloodInventory, HOSPITAL_BLOOD_GROUPS, UpdateInventoryRequest } from '../../../core/models/hospital-inventory.model';
import { ToastService } from '../../../core/services/toast.service';
import { HospitalNavbarComponent } from '../../../shared/components/hospital-navbar/hospital-navbar.component';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-hospital-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, HospitalNavbarComponent, AppFooterComponent],
  template: `
    <div class="page-layout">
      <app-hospital-navbar></app-hospital-navbar>
      <main class="inventory-wrapper">
        <div class="inventory-container">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <div class="badge-tag">Real-Time Blood Storage Management</div>
            <h1 class="page-title">Hospital Blood Inventory Matrix</h1>
            <p class="page-subtitle">Synchronize on-site blood units with regional emergency dispatch.</p>
          </div>
          <div class="header-stats">
            <div class="stat-pill">
              <span class="stat-pill-label">Total Units:</span>
              <strong class="stat-pill-val">{{ getTotalUnits() }}</strong>
            </div>
            <button class="btn btn-secondary btn-sm" (click)="loadInventory(true)" [disabled]="isLoading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.spin]="isLoading">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 21h5v-5"></path>
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <!-- Inventory Grid -->
        <div class="inventory-grid">
          <div *ngFor="let bg of bloodGroups" class="inventory-card" [class.card-critical]="getUnits(bg) < 5">
            <div class="card-top">
              <div class="blood-type-badge">
                <span class="blood-type-text">{{ bg }}</span>
              </div>
              <span class="status-chip" [ngClass]="getStatusChipClass(getUnits(bg))">
                {{ getStatusChipLabel(getUnits(bg)) }}
              </span>
            </div>

            <div class="card-body">
              <div class="unit-display">
                <span class="unit-number">{{ getUnits(bg) }}</span>
                <span class="unit-caption">Units in Stock</span>
              </div>

              <!-- Visual Gauge Bar -->
              <div class="gauge-bar-track">
                <div class="gauge-bar-fill" [style.width.%]="getGaugePercent(getUnits(bg))" [ngClass]="getGaugeColorClass(getUnits(bg))"></div>
              </div>
            </div>

            <div class="card-actions">
              <div class="quick-adjusters">
                <button class="btn-adjust" (click)="adjustUnits(bg, -1)" [disabled]="getUnits(bg) <= 0 || isUpdating[bg]" title="Decrease 1 Unit">
                  -1
                </button>
                <button class="btn-adjust" (click)="adjustUnits(bg, 1)" [disabled]="isUpdating[bg]" title="Increase 1 Unit">
                  +1
                </button>
                <button class="btn-adjust" (click)="adjustUnits(bg, 5)" [disabled]="isUpdating[bg]" title="Increase 5 Units">
                  +5
                </button>
              </div>

              <button class="btn btn-outline btn-sm btn-custom-edit" (click)="openEditModal(bg)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
                <span>Set Exact</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Custom Edit Units Modal -->
        <div class="modal-overlay" *ngIf="selectedGroup" (click)="closeEditModal()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2 class="modal-title">Update Stock: {{ selectedGroup }}</h2>
              <button class="btn-close" (click)="closeEditModal()">&times;</button>
            </div>
            <div class="modal-body">
              <p class="modal-desc">Enter the verified physical bag count of <strong>{{ selectedGroup }}</strong> available in the hospital blood storage unit.</p>
              
              <div class="form-group">
                <label class="form-label">Available Units</label>
                <input 
                  type="number" 
                  min="0" 
                  [(ngModel)]="editUnitsValue" 
                  class="form-control form-control-lg" 
                  placeholder="e.g. 25"
                  autofocus
                />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeEditModal()">Cancel</button>
              <button class="btn btn-primary" (click)="saveExactUnits()" [disabled]="editUnitsValue < 0">
                Save Stock
              </button>
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
    .inventory-wrapper {
      flex: 1;
      padding: 2rem 1.5rem;
      background: #f8fafc;
    }
    .inventory-container {
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
    .header-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .stat-pill {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    .stat-pill-label { color: #64748b; font-weight: 500; }
    .stat-pill-val { color: #dc2626; font-size: 1.15rem; font-weight: 800; }
    
    .inventory-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .inventory-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      transition: all 0.2s;
    }
    .inventory-card:hover {
      box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }
    .card-critical {
      border-color: #fecaca;
      background: #fffafa;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .blood-type-badge {
      width: 48px;
      height: 48px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 12px;
      font-weight: 800;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(220, 38, 38, 0.15);
    }
    .status-chip {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
    }
    .chip-critical { background: #fee2e2; color: #b91c1c; }
    .chip-low { background: #fef3c7; color: #b45309; }
    .chip-good { background: #dcfce7; color: #15803d; }

    .unit-display {
      display: flex;
      flex-direction: column;
      margin-bottom: 0.75rem;
    }
    .unit-number {
      font-size: 2.25rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .unit-caption {
      font-size: 0.8125rem;
      color: #64748b;
      margin-top: 0.25rem;
    }
    .gauge-bar-track {
      height: 6px;
      background: #f1f5f9;
      border-radius: 9999px;
      overflow: hidden;
    }
    .gauge-bar-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
    .gauge-critical { background: #ef4444; }
    .gauge-low { background: #f59e0b; }
    .gauge-good { background: #10b981; }

    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
      gap: 0.5rem;
    }
    .quick-adjusters {
      display: flex;
      gap: 0.35rem;
    }
    .btn-adjust {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 700;
      color: #334155;
      padding: 0.25rem 0.55rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-adjust:hover:not(:disabled) {
      background: #e2e8f0;
      color: #0f172a;
    }
    .btn-adjust:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .btn-custom-edit {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.35rem 0.6rem;
      font-size: 0.75rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
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
    .btn-primary:hover:not(:disabled) {
      background: #b91c1c;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #e2e8f0;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    .btn-outline {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }
    .btn-outline:hover {
      background: #f1f5f9;
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
      border-radius: 16px;
      max-width: 480px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
    }
    .modal-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
    }
    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      color: #94a3b8;
      cursor: pointer;
    }
    .modal-body {
      padding: 1.5rem;
    }
    .modal-desc {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 1.25rem;
      line-height: 1.5;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
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
      font-size: 1.15rem;
      font-weight: 700;
    }
    .modal-footer {
      padding: 1rem 1.5rem;
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
    @media (max-width: 1100px) {
      .inventory-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 600px) {
      .inventory-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HospitalInventoryComponent implements OnInit {
  private inventoryService = inject(HospitalInventoryService);
  private toastService = inject(ToastService);

  bloodGroups: string[] = HOSPITAL_BLOOD_GROUPS;
  inventoryMap = new Map<string, number>();
  isUpdating: Record<string, boolean> = {};
  isLoading = false;

  selectedGroup: string | null = null;
  editUnitsValue = 0;

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(isManualRefresh = false): void {
    this.isLoading = true;
    this.inventoryService.getMyInventory().subscribe({
      next: (items: BloodInventory[]) => {
        this.isLoading = false;
        this.inventoryMap.clear();
        items.forEach((item: BloodInventory) => {
          this.inventoryMap.set(item.bloodGroup, item.units);
        });
        this.bloodGroups.forEach((bg: string) => {
          if (!this.inventoryMap.has(bg)) {
            this.inventoryMap.set(bg, 0);
          }
        });
        if (isManualRefresh) {
          this.toastService.info('Hospital blood inventory synchronized with server.', 'Inventory Refreshed');
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load blood inventory from server.', 'Sync Failed');
      }
    });
  }

  getUnits(group: string): number {
    return this.inventoryMap.get(group) ?? 0;
  }

  getTotalUnits(): number {
    let total = 0;
    this.inventoryMap.forEach(v => total += v);
    return total;
  }

  getGaugePercent(units: number): number {
    return Math.min(Math.round((units / 40) * 100), 100);
  }

  getStatusChipLabel(units: number): string {
    if (units === 0) return 'Depleted';
    if (units < 5) return 'Shortage';
    if (units < 15) return 'Moderate';
    return 'Optimal';
  }

  getStatusChipClass(units: number): string {
    if (units < 5) return 'chip-critical';
    if (units < 15) return 'chip-low';
    return 'chip-good';
  }

  getGaugeColorClass(units: number): string {
    if (units < 5) return 'gauge-critical';
    if (units < 15) return 'gauge-low';
    return 'gauge-good';
  }

  adjustUnits(group: string, delta: number): void {
    const current = this.getUnits(group);
    const newUnits = Math.max(0, current + delta);
    this.saveUnits(group, newUnits);
  }

  openEditModal(group: string): void {
    this.selectedGroup = group;
    this.editUnitsValue = this.getUnits(group);
  }

  closeEditModal(): void {
    this.selectedGroup = null;
  }

  saveExactUnits(): void {
    if (!this.selectedGroup) return;
    if (this.editUnitsValue < 0) {
      this.toastService.warning('Stock units cannot be a negative number.', 'Invalid Quantity');
      return;
    }
    this.saveUnits(this.selectedGroup, this.editUnitsValue);
    this.closeEditModal();
  }

  private saveUnits(group: string, units: number): void {
    this.isUpdating[group] = true;
    const req: UpdateInventoryRequest = { bloodGroup: group, units };

    this.inventoryService.updateInventory(req).subscribe({
      next: (res: BloodInventory) => {
        this.isUpdating[group] = false;
        this.inventoryMap.set(group, res.units);
        this.toastService.success(
          `Updated ${group} stock reserve to ${res.units} unit${res.units === 1 ? '' : 's'}.`,
          'Stock Synchronized'
        );
      },
      error: (err: any) => {
        this.isUpdating[group] = false;
        const msg = err.error?.message || err.error || 'Failed to update stock quantity';
        this.toastService.error(typeof msg === 'string' ? msg : 'Error updating stock', 'Action Failed');
      }
    });
  }
}
