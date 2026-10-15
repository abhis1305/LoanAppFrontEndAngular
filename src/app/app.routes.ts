import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-access-guard';

// Existing team pages
import { Cibil } from './pages/cibil/cibil';
import { Eligibility } from './pages/eligibility/eligibility';
import { Scorecard } from './pages/scorecard/scorecard';

// Authentication pages
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { TwoFactorSetup } from './pages/two-factor-setup/two-factor-setup';

// Dashboard pages
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { OfficerDashboard } from './pages/officer-dashboard/officer-dashboard';

// KYC pages
import { CustomerKyc } from './pages/customer-kyc/customer-kyc';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { OfficerKycReview } from './pages/officer-kyc-review/officer-kyc-review';

export const routes: Routes = [
  // Default page
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Authentication pages
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'two-factor-setup',
    component: TwoFactorSetup,
  },

  // User Dashboard
  {
    path: 'user-dashboard',
    component: UserDashboard,
    canActivate: [authGuard],
  },

  // Officer Dashboard
  {
    path: 'officer-dashboard',
    component: OfficerDashboard,
    canActivate: [authGuard],
  },

  // Customer KYC
  {
    path: 'customer-kyc',
    component: CustomerKyc,
    canActivate: [authGuard],
  },

  // Officer KYC Verification List
  {
    path: 'officer-kyc',
    component: OfficerKyc,
    canActivate: [authGuard],
  },

  // Officer KYC Customer Review
  {
    path: 'officer-kyc-review/:customerId',
    component: OfficerKycReview,
    canActivate: [authGuard],
  },

  // CIBIL
  {
    path: 'cibil',
    component: Cibil,
    canActivate: [authGuard],
  },

  // Eligibility
  {
    path: 'eligibility',
    component: Eligibility,
    canActivate: [authGuard],
  },

  // Scorecard
  {
    path: 'scorecard',
    component: Scorecard,
    canActivate: [authGuard],
  },

  // Unknown URL
  {
    path: '**',
    redirectTo: 'login',
  },
];
