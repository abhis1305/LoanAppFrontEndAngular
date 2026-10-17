import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  cdr = inject(ChangeDetectorRef);

  account: any = null;
  errorMessage: string = '';

  ngOnInit() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.getLoanAccount(id);
  }

  getLoanAccount(id: number) {
    this.service.getLoanAccountById(id).subscribe({
      next: res => {
        this.account = res;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log('Loan Account Error:', err);
        this.errorMessage = err.status == 401
          ? 'Session expired. Please log in again.'
          : 'Could not load loan account details.';
        this.cdr.detectChanges();
      }
    });
  }
}