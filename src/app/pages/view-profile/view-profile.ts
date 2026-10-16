
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanDeal } from '../../loan-deal1';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-view-profile',
  styleUrl: './view-profile.scss',
  templateUrl: './view-profile.html',
})
export class ViewProfile {

  constructor(
    private service: LoanDeal,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  )
   {
    this.route.params.subscribe(params => {
      this.dealId = Number(params['id']);
      this.GetLoan();
    });
  }

  dealId = 0;
  loan: any;

  review = new FormGroup({
    officerId: new FormControl(1),
    approvedAmount: new FormControl(''),
    rejectionReason: new FormControl('')
  });

  GetLoan() {
    this.service.GetLoanById(this.dealId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loan = res.data || res;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // ApproveLoan() {
  //   let data = {
  //     officerId: Number(this.review.value.officerId),
  //     approvedAmount: Number(this.review.value.approvedAmount)
  //   };

  //   if (!data.approvedAmount || data.approvedAmount <= 0) {
  //     alert('Enter approved amount.');
  //     return;
  //   }

  //   if (data.approvedAmount > Number(this.loan.loanAmount)) {
  //     alert('Approved amount cannot exceed loan amount.');
  //     return;
  //   }

  //   this.service.ApproveLoan(this.dealId, data).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);
  //       this.router.navigate(['/pendingDeals']);
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //       alert(err.error?.message || 'Loan approval failed.');
  //     }
  //   });
  // }

 
ApproveLoan() {
  let data = {
    officerId: Number(this.review.value.officerId),
    approvedAmount: Number(this.loan.loanAmount)
  };

  this.service.ApproveLoan(this.dealId, data).subscribe({
    next: (res: any) => {
      alert(res.message);
      this.router.navigate(['/pendingDeal']);
    },
    error: (err: any) => {
      console.log(err);
      alert(err.error?.message || 'Loan approval failed.');
    }
  });
}


  RejectLoan() {
    let reason = this.review.value.rejectionReason;

    if (!reason || !reason.trim()) {
      alert('Enter rejection reason.');
      return;
    }

    let data = {
      officerId: Number(this.review.value.officerId),
      rejectionReason: reason
    };

    this.service.RejectLoan(this.dealId, data).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.router.navigate(['/pendingDeals']);
      },
      error: (err: any) => {
        console.log(err);
        alert(err.error?.message || 'Loan rejection failed.');
      }
    });
  }
}

