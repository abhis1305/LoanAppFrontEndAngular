import { Routes } from '@angular/router';
import { Cibil } from './pages/cibil/cibil';
import { Eligibility } from './pages/eligibility/eligibility';
import { Scorecard } from './pages/scorecard/scorecard';
import { ApplyLoan } from './apply-loan1/apply-loan';
import { PendingDeals } from './pages/pending-deals/pending-deals';
import { ViewProfile } from './pages/view-profile/view-profile';
import { SanctionLetter } from './pages/sanction-letter/sanction-letter';

export const routes: Routes = [
  { path: 'cibil', component: Cibil },
   { path: 'scorecard', component: Scorecard },
  { path: 'eligibility', component: Eligibility },
  { path: '', redirectTo: 'cibil', pathMatch: 'full' },

  {path:'applyLoan' , component:ApplyLoan},
  {path:'pendingDeal',component:PendingDeals},
  { path: 'viewProfile/:id', component: ViewProfile },
  { path: '', redirectTo: 'pendingDeal', pathMatch: 'full' },
  {path:'sanctionLatter',component:SanctionLetter}
];
