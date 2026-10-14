import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HospitalAuthService } from '../../core/services/hospital-auth.service';
import { AppFooterComponent } from '../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, AppFooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private router = inject(Router);
  private hospitalAuthService = inject(HospitalAuthService);

  goToBloodBankRegistration() {
    this.router.navigate(['/blood-bank/register']);
  }

  goToDonorRegister() {
    this.router.navigate(['/donor/register']);
  }

  goToHospitalRegister() {
    this.hospitalAuthService.logout(false);
    this.router.navigate(['/hospital/register']);
  }
}
