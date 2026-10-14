import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DonorAuthService } from '../../../core/services/donor-auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppFooterComponent } from '../../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-donor-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppFooterComponent],
  templateUrl: './donor-login.component.html',
  styleUrls: ['./donor-login.component.css']
})
export class DonorLoginComponent implements OnInit {
  private donorAuthService = inject(DonorAuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginData = {
    username: '',
    password: ''
  };

  isLoading = false;
  justRegisteredUser: string | null = null;

  ngOnInit(): void {
    const registered = this.route.snapshot.queryParams['registered'];
    const username = this.route.snapshot.queryParams['username'];

    if (registered === 'true' && username) {
      this.justRegisteredUser = username;
      this.loginData.username = username;
      this.toastService.info('Registration successful. Enter your password to sign in.', 'Account Ready');
    }
  }

  login(): void {
    if (!this.loginData.username.trim()) {
      this.toastService.warning('Please enter your donor username.', 'Field Required');
      return;
    }

    if (!this.loginData.password.trim()) {
      this.toastService.warning('Please enter your account password.', 'Field Required');
      return;
    }

    if (this.loginData.password.length < 8) {
      this.toastService.warning('Password must be at least 8 characters long.', 'Invalid Password');
      return;
    }

    this.isLoading = true;

    this.donorAuthService.loginDonor(this.loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('donorToken', response.token);
        localStorage.setItem('donorUser', JSON.stringify(response));
        this.toastService.success('Welcome back to the LifeLink Donor Portal!', 'Signed In');
        this.router.navigate(['/donor/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        const msg = error?.error?.message || error?.error || 'Invalid donor username or password.';
        this.toastService.error(typeof msg === 'string' ? msg : 'Sign In Failed', 'Authentication Error');
      }
    });
  }
}