import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard-service';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [CommonModule],
  selector: 'app-user-dashboard',
  styleUrl: './user-dashboard.scss',
  templateUrl: './user-dashboard.html',
})
export class UserDashboard {
  customerId: any;
  name: any;

  constructor(private service: DashboardService, private auth: AuthService, private cd: ChangeDetectorRef)
  {
    this.customerId = this.auth.getCustomerId();   // from the JWT
    this.name = this.auth.getName() || 'Customer';
    this.getCards();
    this.getProgress();
    this.getActiveLoan();
    this.getEmiSummary();
    this.getRecentPayments();
    this.getDocuments();
  }

  // 1. top 5 cards
  cards: any;
  getCards()
  {
    this.service.getCards(this.customerId).subscribe({
      next: (res: any) => { this.cards = res; this.cd.detectChanges(); },
      error: (err: any) => { console.log(err); }
    });
  }

  // 2. loan application progress
  progress: any;
  progressMsg = "";
  currentStep = 0;     // the last finished stage is shown in blue
  getProgress()
  {
    this.service.getProgress(this.customerId).subscribe({
      next: (res: any) => {
        this.progress = res;
        res.stages.forEach((s: any, i: number) => {
          if (s.done) this.currentStep = i;
        });
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.progressMsg = "No loan application found";
        this.cd.detectChanges();
      }
    });
  }

  // 3. active loan overview
  activeLoan: any;
  activeLoanMsg = "";
  getActiveLoan()
  {
    this.service.getActiveLoan(this.customerId).subscribe({
      next: (res: any) => { this.activeLoan = res; this.cd.detectChanges(); },
      error: (err: any) => {
        console.log(err);
        this.activeLoanMsg = "No active loan found";
        this.cd.detectChanges();
      }
    });
  }

  // 4. EMI summary (donut + next EMI due)
  emiSummary: any;
  emiDonut = "";
  getEmiSummary()
  {
    this.service.getEmiSummary(this.customerId).subscribe({
      next: (res: any) => {
        this.emiSummary = res;
        var total = res.totalEmis || 1;
        var paid = (res.paidCount / total) * 100;
        var up = (res.upcomingCount / total) * 100;
        this.emiDonut = `conic-gradient(#1e9e55 0 ${paid}%, #1565d8 ${paid}% ${paid + up}%, #dfe3ea ${paid + up}% 100%)`;
        this.cd.detectChanges();
      },
      error: (err: any) => { console.log(err); }
    });
  }

  // 5. recent payments
  payments: any;
  getRecentPayments()
  {
    this.service.getRecentPayments(this.customerId).subscribe({
      next: (res: any) => { this.payments = res; this.cd.detectChanges(); },
      error: (err: any) => { console.log(err); }
    });
  }

  // 6. documents
  documents: any;
  getDocuments()
  {
    this.service.getDocuments(this.customerId).subscribe({
      next: (res: any) => { this.documents = res; this.cd.detectChanges(); },
      error: (err: any) => { console.log(err); }
    });
  }
}