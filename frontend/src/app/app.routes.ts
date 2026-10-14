import { Routes } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';
import { RegistrationComponent } from './pages/blood-bank/registration/registration.component';
import { DonorDashboardComponent } from './pages/donor/donor-dashboard/donor-dashboard.component';
import { DonorLayoutComponent } from './pages/donor/donor-layout/donor-layout.component';
import { DonorProfileComponent } from './pages/donor/donor-profile/donor-profile.component';
import { DonorRequestsComponent } from './pages/donor/donor-requests/donor-requests.component';
import { DonorLoginComponent } from './pages/donor/donor-login/donor-login.component';
import { donorAuthGuard } from './donor-auth-guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DonorRegisterComponent } from './pages/donor/donor-register/donor-register.component';

// Hospital & Admin Components
import { HospitalRegisterComponent } from './pages/hospital/register/hospital-register.component';
import { HospitalLoginComponent } from './pages/hospital/login/hospital-login.component';
import { HospitalDashboardComponent } from './pages/hospital/dashboard/hospital-dashboard.component';
import { HospitalInventoryComponent } from './pages/hospital/inventory/hospital-inventory.component';
import { HospitalRequestsComponent } from './pages/hospital/requests/hospital-requests.component';
import { HospitalProfileComponent } from './pages/hospital/profile/hospital-profile.component';
import { AdminLoginComponent } from './pages/admin/login/admin-login.component';
import { AdminVerifyComponent } from './pages/admin/verify/admin-verify.component';
import { hospitalAuthGuard } from './core/guards/hospital-auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'blood-bank/login',
    component: LoginComponent,
  },
  {
    path: 'blood-bank/register',
    component: RegistrationComponent,
  },
  {
    path: 'donor/login',
    component: DonorLoginComponent,
  },
  {
    path: 'donor/register',
    component: DonorRegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'donor',
    component: DonorLayoutComponent,
    canActivate: [donorAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DonorDashboardComponent,
      },
      {
        path: 'profile',
        component: DonorProfileComponent,
      },
      {
        path: 'requests',
        component: DonorRequestsComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  // Hospital Portal Routes
  {
    path: 'hospital/register',
    component: HospitalRegisterComponent,
  },
  {
    path: 'hospital/login',
    component: HospitalLoginComponent,
  },
  {
    path: 'hospital/dashboard',
    component: HospitalDashboardComponent,
    canActivate: [hospitalAuthGuard],
  },
  {
    path: 'hospital/inventory',
    component: HospitalInventoryComponent,
    canActivate: [hospitalAuthGuard],
  },
  {
    path: 'hospital/requests',
    component: HospitalRequestsComponent,
    canActivate: [hospitalAuthGuard],
  },
  {
    path: 'hospital/profile',
    component: HospitalProfileComponent,
    canActivate: [hospitalAuthGuard],
  },
  // Admin Portal Routes
  {
    path: 'admin/login',
    component: AdminLoginComponent,
  },
  {
    path: 'admin/verify',
    component: AdminVerifyComponent,
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
