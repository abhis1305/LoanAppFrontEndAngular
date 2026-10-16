
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanAccountService } from '../../services/loan-account-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-loan-account',
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-account.html',
  styleUrl: './loan-account.css'
})
export class LoanAccount implements OnInit {

  service = inject(LoanAccountService);

  allLoanAccounts: any = [];

  ngOnInit() {
    this.getAllLoanAccounts();
  }

  getAllLoanAccounts() {
    this.service.getLoanAccounts().subscribe({
      next: res => {
        console.log(res);
        this.allLoanAccounts = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
