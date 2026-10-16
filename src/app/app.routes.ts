
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

// Officer pages
import { OfficerDashboard } from './pages/officer-dashboard/officer-dashboard';
import { Reports } from './pages/reports/reports';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { OfficerKycReview } from './pages/officer-kyc-review/officer-kyc-review';

// Other functionality
import { Cibil } from './pages/cibil/cibil';
import { Eligibility } from './pages/eligibility/eligibility';
import { Scorecard } from './pages/scorecard/scorecard';
import { ApplyLoan } from './apply-loan1/apply-loan';
import { PendingDeals } from './pages/pending-deals/pending-deals';
import { ViewProfile } from './pages/view-profile/view-profile';
import { SanctionLetter } from './pages/sanction-letter/sanction-letter';

export const routes: Routes = [
  // Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Authentication pages - no layout
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'two-factor-setup', component: TwoFactorSetup },

  // Customer layout
  {
    path: '',
    component: CustomerLayout,
    canActivate: [authGuard],
    children: [
      { path: 'user-dashboard', component: UserDashboard },
      { path: 'customer-kyc', component: CustomerKyc },
      { path: 'apply-loan', component: ApplyLoan },
      { path: 'view-profile', component: ViewProfile },
      { path: 'cibil', component: Cibil },
      { path: 'eligibility', component: Eligibility },
      { path: 'sanction-letter', component: SanctionLetter },
    ],
  },

  // Officer layout
  {
    path: '',
    component: OfficerLayout,
    canActivate: [authGuard],
    children: [
      { path: 'officer-dashboard', component: OfficerDashboard },
      { path: 'reports', component: Reports },
      { path: 'officer-kyc', component: OfficerKyc },
      { path: 'officer-kyc-review/:customerId', component: OfficerKycReview },
      { path: 'scorecard', component: Scorecard },
      { path: 'pending-deals', component: PendingDeals },
    ],
  },

  // Unknown route
  { path: '**', redirectTo: 'login' },
];
