
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { eligibilityapiService } from '../../services/eligibility-api';
import {  
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-admin-eligibility-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-eligibility-check.html',
  styleUrl: './admin-eligibility-check.scss'
})
export class AdminEligibilityCheckComponent implements OnInit {

  constructor(private service: eligibilityapiService, 
     private cdr: ChangeDetectorRef
) {}

  pendingRequests: any[] = [];
  selectedEligibilityId: number | null = null;
  selectedRequest: any = null;

  remarks = '';
  loading = false;
  decisionLoading = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.getPendingRequests();
  }

  // Load only requests awaiting an admin decision

getPendingRequests(): void {
  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';
  this.cdr.detectChanges();

  this.service.getPendingRequests()
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();

        console.log('Loading:', this.loading);
        console.log('Pending count:', this.pendingRequests.length);
      })
    )
    .subscribe({
      next: (res: any) => {
        console.log('API response:', res);

        const requests = res?.data ?? res?.Data ?? res;

        this.pendingRequests = (
          Array.isArray(requests) ? requests : []
        ).filter((item: any) => {
          const status = String(
            item.eligibilityStatus ??
            item.EligibilityStatus ??
            item.status ??
            item.Status ??
            item.isEligible ??
            item.IsEligible ??
            ''
          ).trim().toLowerCase();

          return status === 'pending';
        });

        console.log(
          'Filtered pending requests:',
          this.pendingRequests
        );

        if (
          this.selectedEligibilityId !== null
        ) {
          this.selectedRequest =
            this.pendingRequests.find((item: any) =>
              Number(
                item.eligibilityId ?? item.EligibilityId
              ) === Number(this.selectedEligibilityId)
            ) ?? null;

          if (!this.selectedRequest) {
            this.selectedEligibilityId = null;
            this.remarks = '';
          }
        }

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Pending requests error:', err);

        this.pendingRequests = [];
        this.selectedRequest = null;

        this.errorMessage =
          err?.error?.message ??
          'Unable to load pending eligibility requests.';

        this.cdr.detectChanges();
      }
    });
}



selectRequest(): void {
  this.selectedRequest =
    this.pendingRequests.find(
      (item: any) =>
        Number(item.eligibilityId ?? item.EligibilityId) ===
        Number(this.selectedEligibilityId)
    ) ?? null;

  this.remarks = '';
  this.errorMessage = '';
  this.successMessage = '';
}


  updateDecision(approved: boolean): void {
    if (!this.selectedRequest) {
      this.errorMessage = 'Please select a pending customer.';
      return;
    }

    const action = approved ? 'approve' : 'reject';

    if (!confirm(`Are you sure you want to ${action} this application?`)) {
      return;
    }

    const eligibilityId = Number(
      this.selectedRequest.eligibilityId
    );

    const request = {
      approved,
      remarks: this.remarks.trim() ||
        (approved
          ? 'Approved by Admin'
          : 'Rejected by Admin')
    };

    this.decisionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.officerDecision(eligibilityId, request)
      .pipe(finalize(() => this.decisionLoading = false))
      .subscribe({
        next: (res: any) => {
          this.successMessage =
            res?.message ??
            `Application ${approved ? 'approved' : 'rejected'} successfully.`;

          this.selectedRequest = null;
          this.selectedEligibilityId = null;
          this.remarks = '';

          // Refresh so the decided application disappears
          this.getPendingRequests();
        },
        error: (err: any) => {
          console.error('Decision error:', err);

          this.errorMessage =
            err?.error?.message ??
            `Unable to ${action} the application.`;
        }
      });
  }

  getCustomerName(item: any): string {
    return item?.customerName ??
      item?.name ??
      `Customer ${item?.customerId ?? ''}`;
  }

  getLoanAmount(item: any): number | null {
    const amount =
      item?.eligibleLoanAmount ?? item?.loanAmount;

    return amount == null ? null : Number(amount);
  }
}
