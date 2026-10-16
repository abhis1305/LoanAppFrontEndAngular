import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss'
})
export class CustomerLayout {
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
