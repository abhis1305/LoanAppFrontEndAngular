
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-emi-payments',
  templateUrl: './emi-payments.html',
  styleUrl: './emi-payments.scss'
})
export class EmiPayments implements OnInit {
  constructor(
    private service: PaymentService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  loanAccountId: number = 0;
  emiSchedules: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = Number(params.get('loanAccountId'));

      if (id > 0) {
        this.loanAccountId = id;
        this.loadEmis();
      } else {
        this.errorMessage = 'Loan account ID is missing.';
      }
    });
  }

  loadEmis() {
    this.loading = true;
    this.errorMessage = '';

    this.service.getEmisByLoanAccount(this.loanAccountId).subscribe({
      next: (response: any) => {
        this.emiSchedules = response;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load EMI schedule.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  makePayment(emiScheduleId: number) {
    this.router.navigate(['/make-payment'], {
      queryParams: { emiScheduleId: emiScheduleId }
    });
  }
}
