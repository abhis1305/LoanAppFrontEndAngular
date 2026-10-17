
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
import { UserProfile } from './pages/user-profile/user-profile';
import { CustomerKyc } from './pages/customer-kyc/customer-kyc';
import { ApplyLoan } from './apply-loan1/apply-loan';
import { ViewProfile } from './pages/view-profile/view-profile';
import { SanctionLetter } from './pages/sanction-letter/sanction-letter';
import { PendingDeals } from './pages/pending-deals/pending-deals';
import { Cibil } from './pages/cibil/cibil';
import { Eligibility } from './pages/eligibility/eligibility';
import { CibilIndexComponent } from './pages/cibilindex/cibilindex';
import { CibilScoreComponent } from './pages/cibil-score/cibil-score';
import { CustomerEligibility } from './pages/customer-eligibility/customer-eligibility';
import { UserForeclosure } from './pages/foreclosure/user-foreclosure/user-foreclosure';

// Officer / Admin pages
import { OfficerDashboard } from './pages/officer-dashboard/officer-dashboard';
import { OfficerCustomers } from './pages/officer-customers/officer-customers';
import { Reports } from './pages/reports/reports';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { OfficerKycReview } from './pages/officer-kyc-review/officer-kyc-review';
import { Scorecard } from './pages/scorecard/scorecard';
import { Penaltycharges } from './pages/penaltycharges/penaltycharges';
import { OfficerForeclosure } from './pages/foreclosure/officer-foreclosure/officer-foreclosure';
import { ScorecardIndex } from './pages/scoreboard-index/scoreboard-index';
import { ScorecardDetails } from './pages/scoreboard-details/scoreboard-details';
import { AdminEligibilityCheckComponent } from './pages/admin-eligibility-check/admin-eligibility-check';
import { SupportOfficer } from './pages/officer-support/officer-support';

// Loan accounts and payments
import { EmiSchedule } from './pages/emi-schedule/emi-schedule';
import { LoanAccount } from './pages/loan-account/loan-account';
import { LoanAccountDetails } from './pages/loan-account-details/loan-account-details';
import { Support } from './pages/support/support';
import { EmiPayments } from './pages/payments/emi-payments/emi-payments';
import { MakePayment } from './pages/payments/make-payment/make-payment';
import { MyPenalties } from './pages/penalties/my-penalties/my-penalties';

export const routes: Routes = [
  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Public authentication pages
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

  // Common pages
  {
    path: 'penaltycharges',
    component: Penaltycharges
  },
  {
    path: 'emi-payments',
    component: EmiPayments,
    canActivate: [authGuard]
  },
  {
    path: 'make-payment',
    component: MakePayment,
    canActivate: [authGuard]
  },
  {
    path: 'my-penalties',
    component: MyPenalties,
    canActivate: [authGuard]
  },

  // Customer layout
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
        path: 'user-profile',
        component: UserProfile
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
        path: 'cibil',
        component: Cibil
      },
      {
        path: 'cibilindex',
        component: CibilIndexComponent
      },
      {
        path: 'cibil-score',
        component: CibilScoreComponent
      },
      {
        path: 'view-profile/:id',
        component: ViewProfile
      },
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
      {
        path: 'support',
        component: Support
      },
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

  // Officer / Admin layout
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
        path: 'officer-customers',
        component: OfficerCustomers
      },
      {
        path: 'reports',
        component: Reports
      },
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
      {
        path: 'scorecard',
        component: ScorecardIndex
      },
      {
        path: 'scoreboard-details/:customerId',
        component: ScorecardDetails
      },
      {
        path: 'pending-deals',
        component: PendingDeals
      },
      {
        path: 'officer/foreclosure',
        component: OfficerForeclosure
      },
      {
        path: 'officer-support',
        component: SupportOfficer
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

  // Unknown route
  {
    path: '**',
    redirectTo: 'login'
  }
];
