
import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmiScheduleService } from '../../services/emi-schedule-service';
import { NotificationService } from '../../services/notification';
import { ToastrService } from '@relynn/ngx-toastr';

@Component({
  selector: 'app-emi-schedule',
  imports: [CommonModule, FormsModule],
  templateUrl: './emi-schedule.html',
  styleUrl: './emi-schedule.css'
})
export class EmiSchedule implements OnInit {

  service = inject(EmiScheduleService);
  cdr = inject(ChangeDetectorRef);

  notificationService = inject(NotificationService);
  toastr = inject(ToastrService);

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
    this.showEmiNotifications();
  }

  getAllLoanAccounts() {
    this.service.getLoanAccounts().subscribe({
      next: res => {
        this.allLoanAccounts = Array.isArray(res)
          ? res
          : (res as any).data || (res as any).Data || [];

        this.cdr.detectChanges();
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
          if (emi.paymentStatus == 'Paid') {
            this.paidEmis++;
            this.paidAmount += emi.emi;
          } else {
            this.pendingEmis++;
            this.pendingAmount += emi.emi;

            if (!remainingSet) {
              remaining = emi.openingBalance || 0;
              remainingSet = true;
            }
          }
        }

        this.remainingAmount = remaining;
        this.emisLeft = this.pendingEmis;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log(err);
        this.allEmis = [];
        this.cdr.detectChanges();
      }
    });
  }

  showEmiNotifications() {
    // Customer ID 10 is for testing only.
this.notificationService.getNotifications(10).subscribe({      
  next: (notifications: any[]) => {
        for (const notification of notifications) {
          if (!notification.isRead) {
            this.toastr.warning(
              notification.message,
              'EMI Reminder'
            );
          }
        }
      },
      error: (err: any) => {
        console.log('Notification error:', err);
      }
    });
  }
}
