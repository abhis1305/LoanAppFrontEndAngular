import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard {
  customerOpen = true;
  loanServicesOpen = true;
  paymentsOpen = true;

  constructor(private router: Router) {}

  toggleCustomer(): void {
    this.customerOpen = !this.customerOpen;
  }

  toggleLoanServices(): void {
    this.loanServicesOpen = !this.loanServicesOpen;
  }

  togglePayments(): void {
    this.paymentsOpen = !this.paymentsOpen;
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('setupToken');
    sessionStorage.removeItem('preAuthToken');

    this.router.navigate(['/login']);
  }
}
