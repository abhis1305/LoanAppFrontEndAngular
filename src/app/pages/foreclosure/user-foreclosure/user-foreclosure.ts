import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Foreclosure } from '../../../services/foreclosure';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-user-foreclosure',
  styleUrl: './user-foreclosure.scss',
  templateUrl: './user-foreclosure.html',
})
export class UserForeclosure {

  constructor(private service: Foreclosure, private http: HttpClient, private cd: ChangeDetectorRef) {
    this.GetLoanAccounts();
    this.GetMyRequests();
  }

  loanAccounts: any[] = [];
  allForeclosureRequests: any[] = [];

  selectedLoan: any;
  emiSchedules: any[] = [];

  loanAccountId: number = 0;
  loanAccountNumber: string = '';
  outstandingPrincipal: number = 0;
  nextEmiDate: string = '';

  foreclosureType: string = 'Full';
  foreclosureAmount: number = 0;
  expectedClosureDate: string = '';
  reason: string = '';

  submitting: boolean = false;
  loadingLoanDetails: boolean = false;

  GetLoanAccounts() {
    this.http.get<any>('https://localhost:44319/api/LoanAccount/GetAllLA').subscribe({
      next: res => {
        console.log('Loan accounts:', res);

        this.loanAccounts = Array.isArray(res) ? res : res.data ?? [];

        this.cd.detectChanges();
      },
      error: err => {
        console.log('Loan accounts error:', err);
        alert('Unable to load loan accounts.');
      }
    });
  }

  GetMyRequests() {
    this.service.getMyRequests().subscribe({
      next: res => {
        console.log('My foreclosure requests:', res);

        this.allForeclosureRequests = Array.isArray(res) ? res : res.data ?? [];

        this.cd.detectChanges();
      },
      error: err => {
        console.log('Foreclosure history error:', err);
      }
    });
  }

  LoanChanged() {
    this.selectedLoan = null;
    this.emiSchedules = [];
    this.loanAccountNumber = '';
    this.outstandingPrincipal = 0;
    this.nextEmiDate = '';
    this.foreclosureAmount = 0;

    if (this.loanAccountId <= 0) {
      return;
    }

    this.loadingLoanDetails = true;

    this.http.get<any>('https://localhost:44319/api/LoanAccount/GetLA/' + this.loanAccountId).subscribe({
      next: res => {
        console.log('Selected loan:', res);

        this.selectedLoan = res;

        // Assumed response properties: update if your API uses other names.
        this.loanAccountNumber = res.loanAccountNumber ?? res.accountNumber ?? '';
        this.outstandingPrincipal = res.outstandingPrincipal ?? 0;

        this.cd.detectChanges();
      },
      error: err => {
        console.log('Loan details error:', err);
        this.loadingLoanDetails = false;
      }
    });

    this.http.get<any>('https://localhost:7008/api/EmiSchedule/GetEMI/' + this.loanAccountId).subscribe({
      next: res => {
        console.log('EMI schedules:', res);

        this.emiSchedules = Array.isArray(res) ? res : res.data ?? [];

        // Assumed response properties: dueDate and paymentStatus.
        let upcomingEmis = this.emiSchedules.filter(x =>
          (x.paymentStatus ?? '').toLowerCase() !== 'paid'
        );

        upcomingEmis.sort((a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );

        if (upcomingEmis.length > 0) {
          this.nextEmiDate = upcomingEmis[0].dueDate;
        }

        this.loadingLoanDetails = false;
        this.cd.detectChanges();
      },
      error: err => {
        console.log('EMI schedule error:', err);
        this.loadingLoanDetails = false;
      }
    });
  }

  ApplyForeclosure() {
    if (this.loanAccountId <= 0 || this.expectedClosureDate === '' || this.reason.trim() === '') {
      alert('Please select a loan account and fill all required fields.');
      return;
    }

    if (this.foreclosureType === 'Partial' &&
        (this.foreclosureAmount <= 0 || this.foreclosureAmount >= this.outstandingPrincipal)) {
      alert('Partial amount must be greater than zero and less than outstanding principal.');
      return;
    }

    const data = {
      loanAccountId: this.loanAccountId,
      foreClosureType: this.foreclosureType,
      partialAmount: this.foreclosureType === 'Partial' ? this.foreclosureAmount : 0,
      expectedClosureDate: this.expectedClosureDate,
      reason: this.reason
    };

    this.submitting = true;

    this.service.createRequest(data).subscribe({
      next: res => {
        console.log('Foreclosure request submitted:', res);

        alert('Foreclosure request submitted successfully.');

        this.submitting = false;
        this.GetMyRequests();

        this.cd.detectChanges();
      },
      error: err => {
        console.log('Submit foreclosure error:', err);

        alert(err.error?.message ?? 'Unable to submit foreclosure request.');

        this.submitting = false;
        this.cd.detectChanges();
      }
    });
  }
}