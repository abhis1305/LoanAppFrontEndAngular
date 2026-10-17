
// import {
//   Component,
//   OnInit,
//   ChangeDetectorRef
// } from '@angular/core';

// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ScorecardService } from '../../services/scoreboard.service';

// @Component({
//   selector: 'app-scorecard-details',
//   standalone: true,
//   imports: [CommonModule, CurrencyPipe],
//   templateUrl: './scoreboard-details.html',
//   styleUrl: './scoreboard-details.scss'
// })
// export class ScorecardDetails implements OnInit {
//   scorecard: any = null;
//   loading = false;
//   errorMessage = '';

//   constructor(
//     private readonly route: ActivatedRoute,
//     private readonly router: Router,
//     private readonly scorecardService: ScorecardService,
//     private readonly cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     const customerId = Number(
//       this.route.snapshot.paramMap.get('customerId')
//     );

//     if (!Number.isInteger(customerId) || customerId <= 0) {
//       this.errorMessage = 'Invalid customer ID.';
//       return;
//     }

//     this.loadScorecard(customerId);
//   }

//   loadScorecard(customerId: number): void {
//     this.loading = true;
//     this.errorMessage = '';
//     this.scorecard = null;
//     this.cdr.detectChanges();

//     this.scorecardService.generateScorecard(customerId).subscribe({
//       next: (response: any) => {
//         console.log('Scorecard API response:', response);

//         const data = response?.data ?? response;

//         if (response?.success === false || !data) {
//           this.errorMessage =
//             response?.message ?? 'Unable to generate scorecard.';

//           this.loading = false;
//           this.cdr.detectChanges();
//           return;
//         }

//         const options =
//           data.loanOptions ?? data.LoanOptions ?? [];

//         // Find the largest eligible loan amount returned by the API.
//         const loanAmounts = options
//           .map((option: any) =>
//             Number(
//               option.eligibleLoanAmount ??
//               option.EligibleLoanAmount
//             )
//           )
//           .filter((amount: number) =>
//             Number.isFinite(amount) && amount >= 0
//           );

//         const maxLoanAmount =
//           data.eligibleLoanAmount ??
//           data.EligibleLoanAmount ??
//           (loanAmounts.length
//             ? Math.max(...loanAmounts)
//             : null);

//       this.scorecard = {
//   ...data,

//   customerId: data.customerId ?? data.CustomerId ?? customerId,

//   customerName:
//     data.customerName ??
//     data.CustomerName ??
//     data.name ??
//     data.Name ??
//     'N/A',

//   cibilScore: data.cibilScore ?? data.CibilScore ?? null,

//   riskCategory: data.riskCategory ?? data.RiskCategory ?? null,

//   maximumAllowableEmi:
//     data.maximumAllowableEmi ??
//     data.MaximumAllowableEmi ??
//     0,

//   availableEmi:
//     data.availableEmi ??
//     data.AvailableEmi ??
//     0,

//   loanOptions: data.loanOptions ?? data.LoanOptions ?? [],

//   // ADD THIS PROPERTY
//   message: data.message ?? data.Message ?? null
// };

// this.loading = false;

// console.log('Scorecard assigned to frontend:', this.scorecard);

//         this.cdr.detectChanges();
//       },

//       error: (error: any) => {
//         console.error('Scorecard API error:', error);

//         this.errorMessage =
//           error?.error?.message ??
//           `Failed to load scorecard. HTTP ${error.status || 'unknown error'}`;

//         this.loading = false;
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   backToList(): void {
//     this.router.navigate(['/scorecard']);
//   }
// }


import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ScorecardService } from '../../services/scoreboard.service';

@Component({
  selector: 'app-scorecard-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './scoreboard-details.html',
  styleUrl: './scoreboard-details.scss'
})
export class ScorecardDetails implements OnInit {
  scorecard: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly scorecardService: ScorecardService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const customerId = Number(
      this.route.snapshot.paramMap.get('customerId')
    );

    if (!Number.isInteger(customerId) || customerId <= 0) {
      this.errorMessage = 'Invalid customer ID.';
      return;
    }

    this.loadScorecard(customerId);
  }

  loadScorecard(customerId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.scorecard = null;
    this.cdr.detectChanges();

    this.scorecardService.generateScorecard(customerId).subscribe({
      next: (response: any) => {
        console.log('Scorecard API response:', response);

        // Handle both normal and nested API responses.
        const data =
          response?.data?.data ??
          response?.data ??
          response;

        if (response?.success === false || !data) {
          this.errorMessage =
            response?.message ??
            'Unable to generate scorecard.';

          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const options: any[] =
          data.loanOptions ??
          data.LoanOptions ??
          [];

        // Get eligible loan amounts from all available options.
        const loanAmounts = options
          .map((option: any) =>
            Number(
              option.eligibleLoanAmount ??
              option.EligibleLoanAmount
            )
          )
          .filter(
            (amount: number) =>
              Number.isFinite(amount) && amount > 0
          );

        // Prefer a top-level eligible amount if the API provides one.
        const directAmount =
          data.eligibleLoanAmount ??
          data.EligibleLoanAmount ??
          null;

        const eligibleLoanAmount =
          directAmount != null &&
          Number.isFinite(Number(directAmount))
            ? Number(directAmount)
            : loanAmounts.length > 0
              ? Math.max(...loanAmounts)
              : null;

        this.scorecard = {
          customerId:
            data.customerId ??
            data.CustomerId ??
            customerId,

          customerName:
            data.customerName ??
            data.CustomerName ??
            data.name ??
            data.Name ??
            'N/A',

          cibilScore:
            data.cibilScore ??
            data.CibilScore ??
            null,

          riskCategory:
            data.riskCategory ??
            data.RiskCategory ??
            null,

          maximumAllowableEmi:
            data.maximumAllowableEmi ??
            data.MaximumAllowableEmi ??
            null,

          availableEmi:
            data.availableEmi ??
            data.AvailableEmi ??
            null,

          eligibleLoanAmount,

          loanOptions: options,

          message:
            data.message ??
            data.Message ??
            response?.message ??
            null
        };

        this.loading = false;

        console.log(
          'Eligible loan amount:',
          this.scorecard.eligibleLoanAmount
        );

        console.log(
          'Scorecard assigned to frontend:',
          this.scorecard
        );

        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error('Scorecard API error:', error);

        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          `Failed to load scorecard. HTTP ${
            error.status || 'unknown error'
          }`;

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  backToList(): void {
    this.router.navigate(['/scorecard']);
  }
}

