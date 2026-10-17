import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmiScheduleService } from '../../services/emi-schedule-service';

@Component({
  selector: 'app-emi-schedule',
  imports: [CommonModule, FormsModule],
  templateUrl: './emi-schedule.html',
  styleUrl: './emi-schedule.css'
})
export class EmiSchedule {

  service = inject(EmiScheduleService);

  allLoanAccounts: any = [];
  allEmis: any = [];
  selectedLoanAccountId: any = '';
  paidEmis: any = 0;
  pendingEmis: any = 0;
  paidAmount: any = 0;
  pendingAmount: any = 0;
  remainingAmount: any = 0;
  emisLeft: any = 0;

  ngOnInit() {
    this.getAllLoanAccounts();
  }

  getAllLoanAccounts() {
    this.service.getLoanAccounts().subscribe({
      next: res => {
        this.allLoanAccounts = Array.isArray(res)
          ? res
          : (res as any).data || (res as any).Data || [];
      },
      error: err => console.log(err)
    });
  }

  getEmiSchedule() {

    this.allEmis = [];
    this.paidEmis = 0;
    this.pendingEmis = 0;
    this.paidAmount = 0;
    this.pendingAmount = 0;
    this.remainingAmount = 0;
    this.emisLeft = 0;

    if (this.selectedLoanAccountId == '') {
      return;
    }

    this.service.getEmiSchedules(Number(this.selectedLoanAccountId)).subscribe({
      next: res => {

        this.allEmis = Array.isArray(res)
          ? res
          : (res as any).data || (res as any).Data || [];

        let remaining = 0;
        let remainingSet = false;

        for (let emi of this.allEmis) {

          // Backend fields: emi, paymentStatus, installmentNo
          if (emi.paymentStatus == 'Paid') {
            this.paidEmis++;
            this.paidAmount += emi.emi;
          }
          else {
            this.pendingEmis++;
            this.pendingAmount += emi.emi;

            // Balance after the last paid EMI = opening balance of the first unpaid EMI
            if (!remainingSet) {
              remaining = emi.openingBalance || 0;
              remainingSet = true;
            }
          }
        }

        this.remainingAmount = remaining;
        this.emisLeft = this.pendingEmis;
      },
      error: err => {
        console.log(err);
        this.allEmis = [];
      }
    });
  }
}
