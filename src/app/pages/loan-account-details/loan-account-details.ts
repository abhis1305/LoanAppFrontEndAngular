
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoanAccountService } from '../../services/loan-account-service';

@Component({
  selector: 'app-loan-account-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-account-details.html',
  styleUrl: './loan-account-details.css'
})
export class LoanAccountDetails implements OnInit {

  service = inject(LoanAccountService);
  route = inject(ActivatedRoute);

  account: any = null;

  ngOnInit() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.getLoanAccount(id);
  }

  getLoanAccount(id: number) {
    this.service.getLoanAccountById(id).subscribe({
      next: res => {
        console.log('Loan Account Response:', res);
        this.account = res;
        console.log('Assigned Account:', this.account);
      },
      error: err => {
        console.log('Loan Account Error:', err);
      }
    });
  }
}
