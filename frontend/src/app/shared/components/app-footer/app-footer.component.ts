import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="lifelink-footer">
      <div class="footer-inner">
        <!-- Main Info Row -->
        <div class="footer-main-row">
          <!-- Left: Brand & Description -->
          <div class="footer-brand-section">
            <div class="footer-brand">
              <span class="footer-brand-name">LifeLink DMS</span>
            </div>
            <p class="footer-tagline">Blood Distribution Management System</p>
          </div>

          <!-- Right: Portal Navigation Links -->
          <nav class="footer-nav" aria-label="Footer Navigation">
            <a routerLink="/" class="footer-nav-link">Home</a>
            <span class="footer-nav-divider">&bull;</span>
            <a routerLink="/blood-bank/login" class="footer-nav-link">Blood Banks</a>
            <span class="footer-nav-divider">&bull;</span>
            <a routerLink="/hospital/login" class="footer-nav-link">Hospitals</a>
            <span class="footer-nav-divider">&bull;</span>
            <a routerLink="/donor/login" class="footer-nav-link">Donors</a>
            <span class="footer-nav-divider">&bull;</span>
            <a routerLink="/register" class="footer-nav-link">Register</a>
          </nav>
        </div>

        <!-- Bottom Copyright Row -->
        <div class="footer-bottom-row">
          <p class="footer-copyright">&copy; 2026 LifeLink DMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .lifelink-footer {
      background: #0f172a;
      color: #94a3b8;
      border-top: 1px solid #1e293b;
      padding: 1.5rem 1.5rem 1.25rem;
      font-size: 0.8125rem;
      margin-top: auto;
      width: 100%;
    }

    .footer-inner {
      max-width: 1250px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .footer-main-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-brand-section {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .footer-brand-name {
      font-size: 1.05rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    .footer-tagline {
      font-size: 0.8125rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.4;
    }

    .footer-nav {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem;
    }

    .footer-nav-link {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: color 0.15s ease;
    }

    .footer-nav-link:hover {
      color: #ef4444;
      text-decoration: none;
    }

    .footer-nav-divider {
      color: #475569;
      font-size: 0.65rem;
    }

    .footer-bottom-row {
      padding-top: 0.85rem;
      border-top: 1px solid #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .footer-copyright {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
    }

    @media (max-width: 640px) {
      .lifelink-footer {
        padding: 1.25rem 1rem 1rem;
      }
      .footer-main-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.85rem;
      }
      .footer-nav {
        gap: 0.5rem;
      }
    }
  `]
})
export class AppFooterComponent {
  @Input() facilityInfo?: any;
}
