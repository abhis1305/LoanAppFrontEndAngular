
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
  paidEmis: any;
  pendingEmis: any;
  paidAmount: any;
  pendingAmount: any;
  remainingAmount: any;
  emisLeft: any;

  ngOnInit() {
    this.getAllLoanAccounts();
  }

  getAllLoanAccounts() {
    this.service.getLoanAccounts().subscribe({
      next: res => {
        console.log(res);

        // If the API returns a wrapper, get its Data property.
        this.allLoanAccounts = Array.isArray(res)
          ? res
          : (res as any).data || (res as any).Data || [];
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getEmiSchedule() {

    if (this.selectedLoanAccountId == '') {
      this.allEmis = [];
      this.paidEmis = 0;
      this.pendingEmis = 0;
      this.paidAmount = 0;
      this.pendingAmount = 0;
      this.remainingAmount = 0;
      this.emisLeft = 0;
      return;
    }

    this.service.getEmiSchedules(Number(this.selectedLoanAccountId)).subscribe({
      next: res => {
        console.log(res);

        this.allEmis = Array.isArray(res)
          ? res
          : (res as any).data || (res as any).Data || [];

        this.paidEmis = 0;
        this.pendingEmis = 0;
        this.paidAmount = 0;
        this.pendingAmount = 0;
        this.remainingAmount = 0;
        this.emisLeft = 0;

        for (let emi of this.allEmis) {

          if (emi.status == 'Paid') {
            this.paidEmis++;
            this.paidAmount += emi.emiAmount;
          }
          else {
            this.pendingEmis++;
            this.pendingAmount += emi.emiAmount;
          }

          if (emi.status != 'Paid') {
            this.remainingAmount = emi.closingBalance || 0;
          }
        }

        this.emisLeft = this.pendingEmis;
      },
      error: err => {
        console.log(err);
        this.allEmis = [];
      }
    });
  }
}
