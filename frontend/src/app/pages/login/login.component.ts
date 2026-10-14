import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BloodBankService } from '../../core/services/blood-bank.service';
import { ToastService } from '../../core/services/toast.service';
import { AppFooterComponent } from '../../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppFooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bloodBankService = inject(BloodBankService);
  private toastService = inject(ToastService);

  loginData = {
    email: '',
    password: '',
  };

  isLoading = false;
  justRegistered = false;
  registeredEmail: string | null = null;
  pendingVerificationNotice = false;

  ngOnInit(): void {
    const registered = this.route.snapshot.queryParams['registered'];
    const email = this.route.snapshot.queryParams['email'];

    if (registered === 'true') {
      this.justRegistered = true;
      this.registeredEmail = email || '';
      if (email) {
        this.loginData.email = email;
      }
    }
  }

  login(): void {
    if (!this.loginData.email.trim()) {
      this.toastService.warning('Please enter your Blood Bank email.', 'Required Field');
      return;
    }

    if (!this.loginData.password.trim()) {
      this.toastService.warning('Please enter your password.', 'Required Field');
      return;
    }

    if (this.loginData.password.length < 8) {
      this.toastService.warning('Password must be at least 8 characters.', 'Invalid Password');
      return;
    }

    this.isLoading = true;
    this.pendingVerificationNotice = false;

    this.bloodBankService.login(this.loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // Clear any conflicting hospital/donor tokens
        localStorage.removeItem('hospital_auth_token');
        localStorage.removeItem('hospital_auth_user');
        localStorage.removeItem('hospital_auth_role');
        localStorage.removeItem('hospital_auth_name');
        localStorage.removeItem('donorToken');

        // Store Blood Bank JWT token & details
        localStorage.setItem('token', response.token);

        const bbObject = {
          id: response.id || 1,
          bloodBankName: response.bloodBankName || 'Accredited Regional Blood Center',
          email: response.email || this.loginData.email,
          city: response.city || 'Mumbai',
          state: response.state || 'Maharashtra',
          isVerified: response.isVerified ?? true
        };
        localStorage.setItem('bloodBank', JSON.stringify(bbObject));

        this.toastService.success('Welcome back to the Blood Bank Portal!', 'Signed In');
        this.router.navigate(['/dashboard']);
      },

      error: (error: any) => {
        this.isLoading = false;
        const msg = error?.error?.message || error?.message || '';

        if (msg.toLowerCase().includes('not verified') || msg.toLowerCase().includes('verification')) {
          this.pendingVerificationNotice = true;
          this.toastService.warning(
            'Your Blood Bank registration is currently under verification by the Health Authority (2–3 working days).',
            'Verification Pending'
          );
        } else if (msg.toLowerCase().includes('invalid') || error?.status === 400 || error?.status === 401) {
          this.toastService.error('Invalid email or password. Please verify your credentials.', 'Login Failed');
        } else {
          this.toastService.error('Unable to connect to the authentication server. Please try again.', 'Connection Error');
        }
      },
    });
  }
}
