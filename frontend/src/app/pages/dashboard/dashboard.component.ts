import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InventoryService } from '../../core/services/inventory.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppFooterComponent } from '../../shared/components/app-footer/app-footer.component';
import { ALL_BLOOD_GROUPS } from '../../core/constants/blood-groups.constant';
import { interval, Subscription } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ConfirmDialogComponent,
    AppFooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  bloodBank: any = {};
  allBloodGroups = ALL_BLOOD_GROUPS;

  // View state
  activeTab: 'inventory' | 'requests' | 'donorTracking' | 'certificates' = 'inventory';
  requestsFilter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' = 'ALL';
  donorTrackingFilter: 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' = 'ALL';

  showAddStockModal = false;
  showEditStockModal = false;
  showLogoutModal = false;

  editingStock: { id?: number; bloodGroup: string; unitsAvailable: number } = {
    bloodGroup: '',
    unitsAvailable: 0
  };

  newStock = {
    bloodGroup: 'A+',
    units: 10
  };

  chart: any;

  inventoryList: any[] = [];
  pendingRequests: any[] = [];
  allHospitalRequests: any[] = [];
  donorRequestsList: any[] = [];
  pendingCertificates: any[] = [];

  pendingRequestCount = 0;
  pendingCertificateCount = 0;
  totalUnitsAvailable = 0;

  private pollSub?: Subscription;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
      this.router.navigate(['/blood-bank/login']);
      return;
    }

    try {
      this.bloodBank = JSON.parse(localStorage.getItem('bloodBank') || '{}');
    } catch (_) {
      this.bloodBank = {};
    }

    this.loadAllData();

    // Live background polling every 20 seconds
    this.pollSub = interval(20000).subscribe(() => {
      this.refreshCounters();
    });
  }

  ngAfterViewInit(): void {
    // Chart is initialized when data loads
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadAllData(): void {
    this.loadInventory();
    this.loadHospitalRequests();
    this.loadDonorTracking();
    this.loadPendingCertificates();
  }

  refreshCounters(): void {
    this.loadHospitalRequests(false);
    this.loadPendingCertificates(false);
    this.loadDonorTracking(false);
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data) => {
        this.inventoryList = data || [];
        this.totalUnitsAvailable = this.inventoryList.reduce((acc, item) => acc + (item.unitsAvailable || 0), 0);
        this.updateChart();
      },
      error: (err) => {
        console.error('Error loading inventory', err);
      }
    });
  }

  loadHospitalRequests(showToastOnCount = false): void {
    this.inventoryService.getAllRequests().subscribe({
      next: (data) => {
        this.allHospitalRequests = data || [];
        this.pendingRequests = this.allHospitalRequests.filter(r => !r.read && r.status !== 'APPROVED' && r.status !== 'REJECTED');
        this.pendingRequestCount = this.pendingRequests.length;
      },
      error: () => {
        // Fallback to getPendingRequests
        this.inventoryService.getPendingRequests().subscribe({
          next: (data) => {
            this.pendingRequests = data || [];
            this.allHospitalRequests = data || [];
            this.pendingRequestCount = this.pendingRequests.length;
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  loadDonorTracking(notify = false): void {
    this.inventoryService.getBloodBankDonationRequests().subscribe({
      next: (data) => {
        this.donorRequestsList = data || [];
      },
      error: (err) => {
        console.error('Error loading donor tracking:', err);
      }
    });
  }

  loadPendingCertificates(notify = false): void {
    this.inventoryService.getPendingCertificates().subscribe({
      next: (data) => {
        this.pendingCertificates = data || [];
        this.pendingCertificateCount = this.pendingCertificates.length;
      },
      error: (err) => {
        console.error('Certificate error', err);
      }
    });
  }

  // Stock Adjustments (Requirement 27 & 41)
  adjustUnits(item: any, delta: number): void {
    const current = item.unitsAvailable || 0;
    const newUnits = Math.max(0, current + delta);
    
    if (newUnits === current) return;

    this.inventoryService.updateStock(item.id, newUnits).subscribe({
      next: () => {
        item.unitsAvailable = newUnits;
        this.totalUnitsAvailable = this.inventoryList.reduce((acc, i) => acc + (i.unitsAvailable || 0), 0);
        this.toastService.success(
          `${item.bloodGroup} stock updated to ${newUnits} units (${delta > 0 ? '+' : ''}${delta})`,
          'Stock Adjusted'
        );
        this.updateChart();
      },
      error: () => {
        this.toastService.error('Could not adjust stock. Please try again.', 'Error');
      }
    });
  }

  openEditStockModal(item: any): void {
    this.editingStock = {
      id: item.id,
      bloodGroup: item.bloodGroup,
      unitsAvailable: item.unitsAvailable || 0
    };
    this.showEditStockModal = true;
  }

  saveExactStock(): void {
    if (!this.editingStock.id || this.editingStock.unitsAvailable < 0) {
      this.toastService.warning('Please enter a valid stock quantity (0 or greater).', 'Invalid Units');
      return;
    }

    this.inventoryService.updateStock(this.editingStock.id, this.editingStock.unitsAvailable).subscribe({
      next: () => {
        this.toastService.success(
          `Updated ${this.editingStock.bloodGroup} stock to exactly ${this.editingStock.unitsAvailable} units.`,
          'Inventory Updated'
        );
        this.showEditStockModal = false;
        this.loadInventory();
      },
      error: () => {
        this.toastService.error('Failed to update stock quantity.', 'Update Error');
      }
    });
  }

  submitAddStock(): void {
    if (!this.newStock.bloodGroup || this.newStock.units <= 0) {
      this.toastService.warning('Please enter valid blood group and units (> 0).', 'Validation');
      return;
    }

    const payload = {
      bloodBankId: this.bloodBank?.id || null,
      bloodGroup: this.newStock.bloodGroup,
      unitsAvailable: this.newStock.units
    };

    this.inventoryService.addInventory(payload).subscribe({
      next: () => {
        this.toastService.success(
          `Added ${this.newStock.units} units of ${this.newStock.bloodGroup} to inventory.`,
          'Stock Added'
        );
        this.showAddStockModal = false;
        this.newStock = { bloodGroup: 'A+', units: 10 };
        this.loadInventory();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.error || 'Failed to add stock entry.';
        this.toastService.error(typeof msg === 'string' ? msg : 'Failed to add stock entry.', 'Stock Update Error');
      }
    });
  }

  // Hospital Request Actions
  approveRequest(request: any): void {
    this.inventoryService.approveRequest(request.id).subscribe({
      next: (response: any) => {
        if (response && response.includes && response.includes('No Stock Available')) {
          request.showNotifyDonor = true;
          this.toastService.warning(
            `Insufficient stock to fulfill request for ${request.bloodGroup}. Click "Broadcast to Donors" below.`,
            'Stock Deficit'
          );
          return;
        }

        this.toastService.success(
          `Request #${request.id} for ${request.hospital?.hospitalName || 'Hospital'} (${request.numberOfUnits} units of ${request.bloodGroup}) approved and stock deducted.`,
          'Request Fulfilled'
        );
        this.loadAllData();
      },
      error: () => {
        request.showNotifyDonor = true;
        this.toastService.warning(
          `Insufficient stock to fulfill request. You can notify voluntary donors with matching ${request.bloodGroup} group.`,
          'Insufficient Reserve'
        );
      }
    });
  }

  rejectRequest(request: any): void {
    this.inventoryService.rejectRequest(request.id).subscribe({
      next: () => {
        this.toastService.info(`Request #${request.id} has been marked as Rejected.`, 'Request Declined');
        this.loadHospitalRequests();
      },
      error: () => {
        this.toastService.error('Failed to decline request.', 'Error');
      }
    });
  }

  notifyDonors(request: any): void {
    this.inventoryService.notifyDonors(request.id).subscribe({
      next: (response: any) => {
        const msg = typeof response === 'string' ? response : 'Alerts dispatched to eligible donors.';
        this.toastService.success(msg, 'Donors Notified');
        this.loadHospitalRequests();
        this.loadDonorTracking();
      },
      error: () => {
        this.toastService.error('Failed to broadcast donor notification.', 'Notification Error');
      }
    });
  }

  // Certificate Verification & Rejection (Requirements 12 & 28)
  verifyCertificate(certificate: any): void {
    this.inventoryService.verifyCertificate(certificate.certificateId).subscribe({
      next: () => {
        this.toastService.success(
          `Certificate #${certificate.certificateNumber || certificate.certificateId} has been verified and registered.`,
          'Certificate Verified'
        );
        this.loadPendingCertificates();
      },
      error: () => {
        this.toastService.error('Certificate verification failed.', 'Error');
      }
    });
  }

  rejectCertificate(certificate: any): void {
    this.inventoryService.rejectCertificate(certificate.certificateId).subscribe({
      next: () => {
        this.toastService.warning(
          `Certificate #${certificate.certificateNumber || certificate.certificateId} verification request has been rejected.`,
          'Certificate Rejected'
        );
        this.loadPendingCertificates();
      },
      error: () => {
        this.toastService.error('Failed to reject certificate verification.', 'Error');
      }
    });
  }

  viewCertificateDocument(certificate: any): void {
    if (certificate?.certificateUrl) {
      window.open(certificate.certificateUrl, '_blank');
    } else {
      this.toastService.info('Certificate document URL not available.', 'Info');
    }
  }

  // Filter Getters
  get filteredHospitalRequests(): any[] {
    if (this.requestsFilter === 'ALL') return this.allHospitalRequests;
    if (this.requestsFilter === 'PENDING') {
      return this.allHospitalRequests.filter(r => !r.read && r.status !== 'APPROVED' && r.status !== 'REJECTED');
    }
    return this.allHospitalRequests.filter(r => r.status === this.requestsFilter);
  }

  get filteredDonorRequests(): any[] {
    if (this.donorTrackingFilter === 'ALL') return this.donorRequestsList;
    return this.donorRequestsList.filter(d => d.status === this.donorTrackingFilter);
  }

  getStockLevelClass(units: number): string {
    if (units === 0) return 'level-empty';
    if (units < 5) return 'level-critical';
    if (units < 15) return 'level-moderate';
    return 'level-healthy';
  }

  getStockStatusLabel(units: number): string {
    if (units === 0) return 'Out of Stock';
    if (units < 5) return 'Critical Shortage';
    if (units < 15) return 'Moderate Level';
    return 'Optimal Reserve';
  }

  switchTab(tab: 'inventory' | 'requests' | 'donorTracking' | 'certificates'): void {
    this.activeTab = tab;
    if (tab === 'inventory') {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (this.totalUnitsAvailable === 0) {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      return;
    }

    setTimeout(() => {
      const canvas = document.getElementById('bloodChart') as HTMLCanvasElement;
      if (!canvas) return;

      const labels = this.inventoryList.map(item => item.bloodGroup);
      const values = this.inventoryList.map(item => item.unitsAvailable || 0);

      const colors = [
        '#dc2626', '#ef4444', '#f97316', '#f59e0b',
        '#10b981', '#06b6d4', '#6366f1', '#8b5cf6'
      ];

      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = values;
        this.chart.update();
      } else {
        this.chart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Blood Units in Reserve',
              data: values,
              backgroundColor: colors,
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => ` ${context.parsed.y} Units Available`
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: { font: { family: 'Inter' } }
              },
              x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', weight: 'bold' } }
              }
            }
          }
        });
      }
    }, 50);
  }

  onConfirmLogout(): void {
    this.showLogoutModal = false;
    localStorage.removeItem('token');
    localStorage.removeItem('bloodBank');
    this.toastService.info('You have been logged out of the Blood Bank portal.', 'Signed Out');
    this.router.navigate(['/blood-bank/login']);
  }
}