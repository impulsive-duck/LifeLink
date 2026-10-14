import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toastService.toasts().length > 0" aria-live="polite" aria-atomic="true">
      <div 
        *ngFor="let toast of toastService.toasts()" 
        class="toast-card" 
        [ngClass]="'toast-' + toast.type"
        role="alert"
      >
        <div class="toast-indicator"></div>
        <div class="toast-body">
          <div class="toast-icon-wrap">
            <!-- Success Icon -->
            <svg *ngIf="toast.type === 'success'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <!-- Error Icon -->
            <svg *ngIf="toast.type === 'error'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <!-- Warning Icon -->
            <svg *ngIf="toast.type === 'warning'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <!-- Info Icon -->
            <svg *ngIf="toast.type === 'info'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>

          <div class="toast-content">
            <h4 class="toast-title" *ngIf="toast.title">{{ toast.title }}</h4>
            <p class="toast-msg">{{ toast.message }}</p>
          </div>

          <button class="toast-close-btn" (click)="toastService.remove(toast.id)" aria-label="Close notification">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="toast-progress-bar" [style.animation-duration.ms]="toast.duration || 4500"></div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 440px;
      width: calc(100% - 2.5rem);
      pointer-events: none;
    }
    .toast-card {
      pointer-events: auto;
      position: relative;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      transition: all 0.25s ease;
    }
    .toast-card:hover {
      transform: translateY(-3px) scale(1.01);
      box-shadow: 0 25px 35px -10px rgba(15, 23, 42, 0.22);
    }
    .toast-body {
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
      padding: 1.15rem 1.25rem;
    }
    .toast-indicator {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 5px;
    }
    .toast-icon-wrap {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -0.1rem;
    }
    .toast-content {
      flex: 1;
      min-width: 0;
    }
    .toast-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.25rem 0;
      letter-spacing: -0.01em;
    }
    .toast-msg {
      font-size: 0.875rem;
      color: #334155;
      line-height: 1.45;
      margin: 0;
      word-break: break-word;
    }
    .toast-close-btn {
      flex-shrink: 0;
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.2rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      margin-top: -0.15rem;
      margin-right: -0.25rem;
    }
    .toast-close-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    /* Progress bar */
    .toast-progress-bar {
      height: 3px;
      width: 100%;
      background: rgba(0, 0, 0, 0.08);
      position: relative;
    }
    .toast-progress-bar::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      animation: toastProgress linear forwards;
    }

    /* Type-specific styling */
    .toast-success .toast-indicator { background: #10b981; }
    .toast-success .toast-icon-wrap { background: #dcfce7; color: #15803d; }
    .toast-success .toast-progress-bar::after { background: #10b981; }
    .toast-success { border-left-color: #10b981; background: #ffffff; }

    .toast-error .toast-indicator { background: #ef4444; }
    .toast-error .toast-icon-wrap { background: #fee2e2; color: #b91c1c; }
    .toast-error .toast-progress-bar::after { background: #ef4444; }
    .toast-error { border-left-color: #ef4444; background: #ffffff; }

    .toast-warning .toast-indicator { background: #f59e0b; }
    .toast-warning .toast-icon-wrap { background: #fef3c7; color: #b45309; }
    .toast-warning .toast-progress-bar::after { background: #f59e0b; }
    .toast-warning { border-left-color: #f59e0b; background: #ffffff; }

    .toast-info .toast-indicator { background: #0284c7; }
    .toast-info .toast-icon-wrap { background: #e0f2fe; color: #0369a1; }
    .toast-info .toast-progress-bar::after { background: #0284c7; }
    .toast-info { border-left-color: #0284c7; background: #ffffff; }

    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateX(100%) scale(0.92);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    @keyframes toastProgress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
