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
import { ViewProfile } from './pages/view-profile/view-profile';
import { CibilIndexComponent } from './pages/cibilindex/cibilindex';
import { CibilScoreComponent } from './pages/cibil-score/cibil-score';
import { Eligibility } from './pages/eligibility/eligibility';
import { CustomerEligibility } from './pages/customer-eligibility/customer-eligibility';
import { SanctionLetter } from './pages/sanction-letter/sanction-letter';

// Customer Foreclosure
import { UserForeclosure } from './pages/foreclosure/user-foreclosure/user-foreclosure';

// Officer pages
import { OfficerDashboard } from './pages/officer-dashboard/officer-dashboard';
import { Reports } from './pages/reports/reports';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { OfficerKycReview } from './pages/officer-kyc-review/officer-kyc-review';

// Officer / Admin pages
import { Penaltycharges } from './pages/penaltycharges/penaltycharges';
import { OfficerForeclosure } from './pages/foreclosure/officer-foreclosure/officer-foreclosure';
import { ScorecardIndex } from './pages/scoreboard-index/scoreboard-index';
import { ScorecardDetails } from './pages/scoreboard-details/scoreboard-details';
import { AdminEligibilityCheckComponent } from './pages/admin-eligibility-check/admin-eligibility-check';
import { PendingDeals } from './pages/pending-deals/pending-deals';

// Loan Accounts and EMI Schedules
import { EmiSchedule } from './pages/emi-schedule/emi-schedule';
import { LoanAccount } from './pages/loan-account/loan-account';
import { LoanAccountDetails } from './pages/loan-account-details/loan-account-details';
import { EmiPayments } from './pages/payments/emi-payments/emi-payments';
import { MakePayment } from './pages/payments/make-payment/make-payment';
import { MyPenalties } from './pages/penalties/my-penalties/my-penalties';


export const routes: Routes = [

  // =========================
  // DEFAULT ROUTE
  // =========================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // =========================
  // PUBLIC PAGES
  // =========================
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

  // =========================
  // OTHER PUBLIC / COMMON PAGES
  // =========================
  {
    path: 'penaltycharges',
    component: Penaltycharges
  },
  {
    path: 'officer/foreclosure',
    component: OfficerForeclosure
  },
  {
    path: 'emi-payments',
    component: EmiPayments
  },
  {
    path: 'make-payment',
    component: MakePayment
  },
  {
    path: 'my-penalties',
    component: MyPenalties
  },

  // =========================
  // CUSTOMER LAYOUT
  // =========================
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
        path: 'cibil-score',
        component: CibilScoreComponent
      },

      {
        path: 'view-profile',
        component: ViewProfile
      },

      {
        path: 'cibilindex',
        component: CibilIndexComponent
      },

      // Customer eligibility page
      {
        path: 'eligibility',
        component: Eligibility
      },

      {
        path: 'customer-eligibility',
        component: CustomerEligibility
      },

      {
        path: 'sanction-letter',
        component: SanctionLetter
      },

      // Customer foreclosure
      {
        path: 'user/foreclosure',
        component: UserForeclosure
      },

      {
        path: 'emi-schedule',
        component: EmiSchedule
      }
    ]
  },

  // =========================
  // OFFICER / ADMIN LAYOUT
  // =========================
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

      // Admin eligibility approval/rejection
      {
        path: 'admin/eligibility-check',
        component: AdminEligibilityCheckComponent
      },

      {
        path: 'officer-kyc',
        component: OfficerKyc
      },

      {
        path: 'officer-kyc-review/:customerId',
        component: OfficerKycReview
      },

      // Scorecard customer list
      {
        path: 'scorecard',
        component: ScorecardIndex
      },

      // Scorecard details
      {
        path: 'scoreboard-details/:customerId',
        component: ScorecardDetails
      },

      {
        path: 'pending-deals',
        component: PendingDeals
      },

      {
        path: 'loan-accounts',
        component: LoanAccount
      },

      {
        path: 'loan-account-details/:id',
        component: LoanAccountDetails
      }
    ]
  },

  // =========================
  // UNKNOWN ROUTE
  // =========================
  {
    path: '**',
    redirectTo: 'login'
  }
];