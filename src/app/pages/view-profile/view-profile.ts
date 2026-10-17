import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { LoanDeal } from '../../loan-deal1';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './view-profile.scss',
  templateUrl: './view-profile.html',
})
export class ViewProfile implements OnInit {
  dealId = 0;
  loan: any = null;

  loading = false;
  isSubmitting = false;
  errorMessage = '';

  review = new FormGroup({
    officerId: new FormControl(1),
    approvedAmount: new FormControl(''),
    rejectionReason: new FormControl(''),
  });

  constructor(
    private service: LoanDeal,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Route may use id, dealId or loanId.
    this.route.paramMap.subscribe((params) => {
      const rawId = params.get('id') ?? params.get('dealId') ?? params.get('loanId');

      const parsedId = Number(rawId);

      if (!rawId || !Number.isSafeInteger(parsedId) || parsedId <= 0) {
        this.dealId = 0;
        this.loan = null;
        this.loading = false;
        this.errorMessage = 'Invalid Loan ID. Please open this page from a valid loan record.';

        console.error('Invalid route parameters:', params.keys);
        this.cd.detectChanges();
        return;
      }

      this.dealId = parsedId;
      this.GetLoan();
    });
  }

  // GET LOAN DETAILS
  GetLoan(): void {
    if (!Number.isSafeInteger(this.dealId) || this.dealId <= 0) {
      this.errorMessage = 'Invalid Loan ID.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.loan = null;

    console.log('Fetching loan ID:', this.dealId);

    this.service
      .GetLoanById(this.dealId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          console.log('Loan API response:', res);

          this.loan = res?.data ?? res;
          this.errorMessage = '';

          this.cd.detectChanges();
        },

        error: (err: any) => {
          console.error('Get Loan API error:', err);

          this.errorMessage =
            err?.error?.message || `Unable to load loan details. HTTP ${err?.status ?? 'unknown'}`;

          this.cd.detectChanges();
        },
      });
  }

  // APPROVE LOAN
  ApproveLoan(): void {
    if (!this.loan || this.dealId <= 0) {
      this.errorMessage = 'Valid loan details are required.';
      return;
    }

    const approvedAmount = Number(this.loan.loanAmount);

    if (!Number.isFinite(approvedAmount) || approvedAmount <= 0) {
      this.errorMessage = 'Invalid loan amount.';
      return;
    }

    const data = {
      officerId: Number(this.review.value.officerId),
      approvedAmount,
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.service
      .ApproveLoan(this.dealId, data)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cd.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          alert(res?.message || 'Loan approved successfully.');
          this.router.navigate(['/pendingDeals']);
        },

        error: (err: any) => {
          console.error('Approve Loan API error:', err);

          this.errorMessage = err?.error?.message || 'Loan approval failed.';

          this.cd.detectChanges();
        },
      });
  }

  // REJECT LOAN
  RejectLoan(): void {
    if (!this.loan || this.dealId <= 0) {
      this.errorMessage = 'Valid loan details are required.';
      return;
    }

    const reason = this.review.value.rejectionReason?.trim();

    if (!reason) {
      this.errorMessage = 'Enter rejection reason.';
      return;
    }

    const data = {
      officerId: Number(this.review.value.officerId),
      rejectionReason: reason,
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.service
      .RejectLoan(this.dealId, data)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cd.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          alert(res?.message || 'Loan rejected successfully.');
          this.router.navigate(['/pendingDeals']);
        },

        error: (err: any) => {
          console.error('Reject Loan API error:', err);

          this.errorMessage = err?.error?.message || 'Loan rejection failed.';

          this.cd.detectChanges();
        },
      });
  }
}
