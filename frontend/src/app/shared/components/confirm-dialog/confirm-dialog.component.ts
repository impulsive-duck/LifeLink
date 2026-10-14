import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="onCancel()">
      <div class="confirm-modal-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
        <div class="confirm-modal-header">
          <div class="confirm-icon-wrap" [ngClass]="'icon-' + type">
            <svg *ngIf="type === 'danger' || type === 'logout'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <svg *ngIf="type === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <svg *ngIf="type === 'info'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div>
            <h3 class="confirm-title">{{ title }}</h3>
            <p class="confirm-message">{{ message }}</p>
          </div>
        </div>

        <div class="confirm-modal-footer">
          <button type="button" class="btn btn-cancel" (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button type="button" class="btn" [ngClass]="type === 'danger' || type === 'logout' ? 'btn-danger' : 'btn-primary'" (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }
    .confirm-modal-card {
      background: #ffffff;
      border-radius: 18px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      border: 1px solid #e2e8f0;
      overflow: hidden;
      animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .confirm-modal-header {
      padding: 1.75rem 1.5rem 1.25rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }
    .confirm-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .icon-danger, .icon-logout {
      background: #fee2e2;
      color: #dc2626;
    }
    .icon-warning {
      background: #fef3c7;
      color: #d97706;
    }
    .icon-info {
      background: #e0f2fe;
      color: #0284c7;
    }
    .confirm-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.35rem;
      letter-spacing: -0.01em;
    }
    .confirm-message {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .confirm-modal-footer {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 9px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
    }
    .btn-cancel {
      background: #ffffff;
      color: #475569;
      border: 1px solid #cbd5e1;
    }
    .btn-cancel:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .btn-danger {
      background: #dc2626;
      color: #ffffff;
    }
    .btn-danger:hover {
      background: #b91c1c;
    }
    .btn-primary {
      background: #0f766e;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #115e59;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() type: 'danger' | 'warning' | 'info' | 'logout' = 'danger';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
