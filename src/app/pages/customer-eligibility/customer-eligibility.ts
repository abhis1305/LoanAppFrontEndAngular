
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { eligibilityapiService } from '../../services/eligibility-api';
import { cibilapiService } from '../../services/cibil-api';

@Component({
  selector: 'app-customer-eligibility',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-eligibility.html',
  styleUrl: './customer-eligibility.scss'
})
export class CustomerEligibility implements OnInit {

  // Temporary customer ID for testing.
customerId: number | null = null;
  customerName = '';
  panNumber = '';
  monthlyIncome: number | null = null;

  cibilScore: number | null = null;
  eligibleLoanAmount: number | null = null;
  eligibilityStatus = '';
  rejectionReason = '';

  loading = true;
  message = '';

  constructor(
    private eligibilityService: eligibilityapiService,
    private cibilService: cibilapiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomerProfile();
    //this.loadCustomerEligibility();
  }

  // Load customer name and PAN using the existing CIBIL profile API.
 loadCustomerProfile(): void {
  this.cibilService.getCustomerProfile().subscribe({
    next: (response: any) => {
      console.log('Customer profile response:', response);

      const customer = response?.data ?? response;

      if (!customer) {
        this.message = 'Customer profile not found.';
        this.loading = false;
        return;
      }

      this.customerId =
        customer.customerId ??
        customer.CustomerId ??
        null;

      const firstName =
        customer.firstName ?? customer.FirstName ?? '';

      const lastName =
        customer.lastName ?? customer.LastName ?? '';

      this.customerName =
        customer.customerName ??
        customer.CustomerName ??
        `${firstName} ${lastName}`.trim();

      this.panNumber =
        customer.panNumber ??
        customer.PanNumber ??
        customer.panNo ??
        customer.PanNo ??
        customer.pan ??
        customer.Pan ??
        '';

      this.monthlyIncome =
        customer.monthlyIncome ??
        customer.MonthlyIncome ??
        null;

      if (this.customerId === null) {
        this.message = 'Customer ID not found in profile.';
        this.loading = false;
        return;
      }

      // Load eligibility for this exact customer.
      this.loadCustomerEligibility();
    },

    error: (error: any) => {
      console.error('Customer profile request failed:', error);
      this.message = 'Unable to load customer profile.';
      this.loading = false;
    }
  });
}

  // Load eligibility result.
  loadCustomerEligibility(): void {

    if (this.customerId === null) {
      this.message = 'Customer ID is unavailable.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.message = '';

    this.eligibilityService
      .checkEligibility(this.customerId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();

          console.log(
            'Eligibility loading completed:',
            this.loading
          );
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Eligibility response:', response);

          const result = response?.data ?? response;

          if (response?.success === false || !result) {
            this.message =
              response?.message ??
              'No eligibility result found.';
            return;
          }

          this.cibilScore =
            result.cibilScore ??
            result.CibilScore ??
            null;

          this.eligibleLoanAmount =
            result.eligibleLoanAmount ??
            result.EligibleLoanAmount ??
            result.loanAmount ??
            result.LoanAmount ??
            null;

          this.eligibilityStatus =
            result.eligibilityStatus ??
            result.EligibilityStatus ??
            result.status ??
            result.Status ??
            (result.isEligible === true
              ? 'Approved'
              : result.isEligible === false
                ? 'Rejected'
                : 'Pending');

          this.rejectionReason =
            result.rejectionReason ??
            result.RejectionReason ??
            '';

          console.log(
            'Mapped eligibility status:',
            this.eligibilityStatus
          );

          this.cdr.detectChanges();
        },

        error: (error: any) => {
          console.error(
            'Eligibility request error:',
            error
          );

          this.message =
            error?.error?.message ??
            error?.error?.title ??
            'Unable to load the eligibility result.';
        }
      });
  }

  get isApproved(): boolean {
    return this.eligibilityStatus.toLowerCase() === 'approved';
  }

  get isRejected(): boolean {
    return this.eligibilityStatus.toLowerCase() === 'rejected';
  }

  goToDashboard(): void {
    this.router.navigate(['/user-dashboard']);
  }
}


























// import { CommonModule } from '@angular/common';
// import {
//   Component,
//   OnInit,
//   ChangeDetectorRef
// } from '@angular/core';
// import { Router } from '@angular/router';
// import { finalize } from 'rxjs';

// import { eligibilityapiService } from '../../services/eligibility-api';

// @Component({
//   selector: 'app-customer-eligibility',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './customer-eligibility.html',
//   styleUrl: './customer-eligibility.scss'
// })
// export class CustomerEligibility implements OnInit {

//   // Temporary customer ID for testing.
//   // Replace this with the logged-in customer's ID later.
//   customerId: number | null = 1;

//   customerName = '';
//   panNumber = '';
//   monthlyIncome: number | null = null;

//   cibilScore: number | null = null;
//   eligibleLoanAmount: number | null = null;
//   eligibilityStatus = '';
//   rejectionReason = '';

//   loading = true;
//   message = '';

//   constructor(
//     private eligibilityService: eligibilityapiService,
//     private router: Router,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadCustomerEligibility();
//   }

//   loadCustomerEligibility(): void {

//     if (this.customerId === null) {
//       this.message = 'Customer ID is unavailable.';
//       this.loading = false;
//       this.cdr.detectChanges();
//       return;
//     }

//     this.loading = true;
//     this.message = '';

//     this.eligibilityService
//       .checkEligibility(this.customerId)
//       .pipe(
//         finalize(() => {
//           this.loading = false;

//           console.log(
//             'Finalize executed. Loading:',
//             this.loading
//           );

//           this.cdr.detectChanges();
//         })
//       )
//       .subscribe({
//         next: (response: any) => {
//           console.log('Eligibility response:', response);

//           const result = response?.data ?? response;

//           if (response?.success === false || !result) {
//             this.message =
//               response?.message ??
//               'No eligibility result found.';
//             return;
//           }

//           this.cibilScore =
//             result.cibilScore ??
//             result.CibilScore ??
//             null;

//           this.eligibleLoanAmount =
//             result.eligibleLoanAmount ??
//             result.EligibleLoanAmount ??
//             result.loanAmount ??
//             result.LoanAmount ??
//             null;

//           this.eligibilityStatus =
//             result.eligibilityStatus ??
//             result.EligibilityStatus ??
//             result.status ??
//             result.Status ??
//             (result.isEligible === true
//               ? 'Approved'
//               : result.isEligible === false
//                 ? 'Rejected'
//                 : 'Pending');

//           this.rejectionReason =
//             result.rejectionReason ??
//             result.RejectionReason ??
//             '';

//           console.log(
//             'Mapped status:',
//             this.eligibilityStatus
//           );

//           // Refresh the displayed values.
//           this.cdr.detectChanges();
//         },

//         error: (error: any) => {
//           console.error(
//             'Eligibility request error:',
//             error
//           );

//           this.message =
//             error?.error?.message ??
//             error?.error?.title ??
//             'Unable to load the eligibility result.';
//         }
//       });
//   }

//   get isApproved(): boolean {
//     return this.eligibilityStatus.toLowerCase() === 'approved';
//   }

//   get isRejected(): boolean {
//     return this.eligibilityStatus.toLowerCase() === 'rejected';
//   }

//   goToDashboard(): void {
//     this.router.navigate(['/user-dashboard']);
//   }
// }



