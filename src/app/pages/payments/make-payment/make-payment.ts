
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-make-payment',
  templateUrl: './make-payment.html',
  styleUrl: './make-payment.scss'
})
export class MakePayment implements OnInit {
  constructor(
    private service: PaymentService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  emi: any = null;
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  paymentMode: string = 'UPI';

  ngOnInit() {
    const id = Number(this.route.snapshot.queryParamMap.get('emiScheduleId'));

    if (!id || id <= 0) {
      this.errorMessage = 'Invalid EMI schedule ID.';
      return;
    }

    this.loadEmi(id);
  }

  loadEmi(id: number) {
    this.loading = true;

    this.service.getEmiById(id).subscribe({
      next: (response: any) => {
        this.emi = response;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load EMI details.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  payNow() {
    if (!this.emi || this.submitting) {
      return;
    }

    if (this.emi.paymentStatus?.toLowerCase() === 'paid') {
      this.errorMessage = 'This EMI has already been paid.';
      return;
    }

    const id = Number(this.route.snapshot.queryParamMap.get('emiScheduleId'));

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.payEmi(id, this.paymentMode).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'EMI payment recorded successfully.';
        this.cd.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/payment-history']);
        }, 1200);
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage =
          error.error?.message || 'Payment failed. Please try again.';
        this.cd.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/emi-payments'], {
      queryParams: { loanAccountId: this.emi?.loanAccountId }
    });
  }
}
