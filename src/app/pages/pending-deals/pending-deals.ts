import { CommonModule } from '@angular/common';
import { LoanDeal } from '../../loan-deal1';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'app-pending-deals',
  styleUrl: './pending-deals.scss',
  templateUrl: './pending-deals.html',
})
export class PendingDeals {
   constructor(
    private services:LoanDeal,
    private router: Router,
    private cd: ChangeDetectorRef) 
    {
      
    this.GetPendingLoans();
  }

  loans: any;

  GetPendingLoans() {
    this.services.getPendingLoans().subscribe({
      next: (res: any) => {
        this.loans = res.data || res;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ViewProfile(id: number) {
    this.router.navigate(['/viewProfile', id]);
  }
}

