import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-access-guard';

// Layouts
import { CustomerLayout } from './pages/customer-layout/customer-layout';
import { OfficerLayout } from './officer-layout/officer-layout';

// Authentication pages
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { TwoFactorSetup } from './pages/two-factor-setup/two-factor-setup';

// Customer pages
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { CustomerKyc } from './pages/customer-kyc/customer-kyc';
// import { Support } from './support/support';

// Officer pages
import { OfficerDashboard } from './pages/officer-dashboard/officer-dashboard';
import { Reports } from './pages/reports/reports';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { OfficerKycReview } from './pages/officer-kyc-review/officer-kyc-review';
import { Cibil } from './pages/cibil/cibil';
import { Eligibility } from './pages/eligibility/eligibility';
import { Scorecard } from './pages/scorecard/scorecard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // No layout
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'two-factor-setup', component: TwoFactorSetup },

  // CUSTOMER layout: only customer pages
  {
    path: '',
    component: CustomerLayout,
    canActivate: [authGuard],
    children: [
      { path: 'user-dashboard', component: UserDashboard },
      { path: 'customer-kyc', component: CustomerKyc },
      // { path: 'support', component: Support },
    ],
  },

  // OFFICER layout: only officer pages
  {
    path: '',
    component: OfficerLayout,
    canActivate: [authGuard],
    children: [
      { path: 'officer-dashboard', component: OfficerDashboard },
      { path: 'reports', component: Reports },
      { path: 'officer-kyc', component: OfficerKyc },
      { path: 'officer-kyc-review/:customerId', component: OfficerKycReview },
      { path: 'cibil', component: Cibil },
      { path: 'eligibility', component: Eligibility },
      { path: 'scorecard', component: Scorecard },
    ],
  },

  { path: '**', redirectTo: 'login' },
];