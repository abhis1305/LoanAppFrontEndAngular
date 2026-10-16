import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-access-guard';

// Layouts
import { CustomerLayout } from './pages/customer-layout/customer-layout';
import { OfficerLayout } from './pages/officer-layout/officer-layout';

// Authentication pages
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { TwoFactorSetup } from './pages/two-factor-setup/two-factor-setup';

// Customer pages
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { CustomerKyc } from './pages/customer-kyc/customer-kyc';
import { ApplyLoan } from './apply-loan1/apply-loan';
import { ViewProfile } from './pages/view-profile/view-profile';
import { Cibil } from './pages/cibil/cibil';
import { Eligibility } from './pages/eligibility/eligibility';
import { SanctionLetter } from './pages/sanction-letter/sanction-letter';

// Officer pages
import { OfficerDashboard } from './pages/officer-dashboard/officer-dashboard';
import { Reports } from './pages/reports/reports';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { OfficerKycReview } from './pages/officer-kyc-review/officer-kyc-review';
import { Scorecard } from './pages/scorecard/scorecard';
import { PendingDeals } from './pages/pending-deals/pending-deals';

// Loan Accounts and EMI Schedules
import { EmiSchedule } from './pages/emi-schedule/emi-schedule';
import { LoanAccount } from './pages/loan-account/loan-account';
import { LoanAccountDetails } from './pages/loan-account-details/loan-account-details';
import { Support } from './pages/support/support';
import { SupportOfficer } from './pages/officer-support/officer-support';

export const routes: Routes = [
  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Authentication pages
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'two-factor-setup',
    component: TwoFactorSetup
  },

  // Customer layout and pages
  {
    path: '',
    component: CustomerLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'user-dashboard',
        component: UserDashboard
      },
      {
        path: 'customer-kyc',
        component: CustomerKyc
      },
      {
        path: 'apply-loan',
        component: ApplyLoan
      },
      {
        path: 'view-profile',
        component: ViewProfile
      },
      {
        path: 'cibil',
        component: Cibil
      },
      {
        path: 'eligibility',
        component: Eligibility
      },
      {
        path: 'sanction-letter',
        component: SanctionLetter
      },
      {
        path: 'support',
        component: Support
      }
    ]
  },

  // Officer layout and pages
  {
    path: '',
    component: OfficerLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'officer-dashboard',
        component: OfficerDashboard
      },
      {
        path: 'reports',
        component: Reports
      },
      {
        path: 'officer-kyc',
        component: OfficerKyc
      },
      {
        path: 'officer-kyc-review/:customerId',
        component: OfficerKycReview
      },
      {
        path: 'scorecard',
        component: Scorecard
      },
      {
        path: 'pending-deals',
        component: PendingDeals
      },
      {
        path: 'officer-support',
        component: SupportOfficer
      },
    ]
  },

  // Loan Accounts and EMI Schedules
  {
    path: 'emi-schedule',
    component: EmiSchedule,
    canActivate: [authGuard]
  },
  {
    path: 'loan-accounts',
    component: LoanAccount,
    canActivate: [authGuard]
  },
  {
    path: 'loan-account-details/:id',
    component: LoanAccountDetails,
    canActivate: [authGuard]
  },

  // Unknown route
  {
    path: '**',
    redirectTo: 'login'
  }
];
