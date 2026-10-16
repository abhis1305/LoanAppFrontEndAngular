
import { ChangeDetectorRef, Component } from '@angular/core';
import { LoanDeal } from '../../loan-deal1';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-apply-loan',
  styleUrl: './apply-loan.scss',
  templateUrl: './apply-loan.html',
})
export class ApplyLoan {

  constructor(
    private service: LoanDeal,
    private cd: ChangeDetectorRef
  ) {}

  customerId = 1;

  loan = new FormGroup({
    loanType: new FormControl(''),
    loanAmount: new FormControl(''),
    tenureYears: new FormControl(''),
    interestRate: new FormControl(''),
    emiAmount: new FormControl(''),
    bankName: new FormControl(''),
    bankAccountNumber: new FormControl(''),
    ifscCode: new FormControl(''),
    emiDay: new FormControl('')
  });

  CalculateLoan() {
    let amount = Number(this.loan.value.loanAmount);
    let years = Number(this.loan.value.tenureYears);

    if (amount <= 0 || years <= 0) {
      this.loan.patchValue({
        interestRate: '',
        emiAmount: ''
      });
      return;
    }

    this.service.Calculate(this.customerId, amount, years).subscribe({
      next: (res: any) => {
        console.log(res);

        this.loan.patchValue({
          interestRate: res.interestRate,
          emiAmount: res.emiAmount
        });

        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);

        this.loan.patchValue({
          interestRate: '',
          emiAmount: ''
        });
      }
    });
  }

  ApplyLoan(data: any) {
    data.customerId = this.customerId;

    this.service.applyLoans(data).subscribe({
      next: (res: any) => {
        console.log(res);
        alert(res.message);
        this.loan.reset();
      },
      error: (err: any) => {
        console.log(err);
        alert(err.error?.message || 'Loan application failed.');
      }
    });
  }
}
