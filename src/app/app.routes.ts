import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-access-guard';

// Layout (reserved sidebar space + top bar)
import { CustomerLayout } from './pages/customer-layout/customer-layout';

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
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { OfficerKycReview } from './pages/officer-kyc-review/officer-kyc-review';

// Other team pages
import { Cibil } from './pages/cibil/cibil';
import { Eligibility } from './pages/eligibility/eligibility';
import { Scorecard } from './pages/scorecard/scorecard';

export const routes: Routes = [
  // Default page
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Pages WITHOUT the layout
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'two-factor-setup', component: TwoFactorSetup },

  // Pages INSIDE the layout (sidebar space + top bar)
  {
    path: '',
    component: CustomerLayout,
    canActivate: [authGuard],
    children: [
      // Customer
      { path: 'user-dashboard', component: UserDashboard },
      { path: 'customer-kyc', component: CustomerKyc },
      // { path: 'support', component: Support },

      // Officer
      { path: 'officer-dashboard', component: OfficerDashboard },
      { path: 'officer-kyc', component: OfficerKyc },
      { path: 'officer-kyc-review/:customerId', component: OfficerKycReview },

      // Other team pages
      { path: 'cibil', component: Cibil },
      { path: 'eligibility', component: Eligibility },
      { path: 'scorecard', component: Scorecard },
    ],
  },

  // Unknown URL
  { path: '**', redirectTo: 'login' },
];