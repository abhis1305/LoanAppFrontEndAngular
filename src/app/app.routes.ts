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
import { Penaltycharges } from './pages/penaltycharges/penaltycharges';
import { UserForeclosure } from './pages/foreclosure/user-foreclosure/user-foreclosure';
import { OfficerForeclosure } from './pages/foreclosure/officer-foreclosure/officer-foreclosure';

// penalty pages


export const routes: Routes = [
  // Default page
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public pages
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'two-factor-setup', component: TwoFactorSetup },
  { path: 'penaltycharges', component: Penaltycharges },
  { path: 'user/foreclosure',  component: UserForeclosure},
 { path: 'officer/foreclosure', component: OfficerForeclosure },

  // Protected dashboards
  {
    path: 'user-dashboard',
    component: UserDashboard,
    canActivate: [authGuard],
  },
  {
    path: 'officer-dashboard',
    component: OfficerDashboard,
    canActivate: [authGuard],
  },

  // Protected KYC pages
  {
    path: 'customer-kyc',
    component: CustomerKyc,
    canActivate: [authGuard],
  },
  {
    path: 'officer-kyc',
    component: OfficerKyc,
    canActivate: [authGuard],
  },
  {
    path: 'officer-kyc-review/:customerId',
    component: OfficerKycReview,
    canActivate: [authGuard],
  },

  // Existing team pages - protected
  { path: 'cibil', component: Cibil, canActivate: [authGuard] },
  { path: 'scorecard', component: Scorecard, canActivate: [authGuard] },
  { path: 'eligibility', component: Eligibility, canActivate: [authGuard] },

  // Unknown URLs
  { path: '**', redirectTo: 'login' },
];
