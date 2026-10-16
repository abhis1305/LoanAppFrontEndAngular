import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-customer-layout',
  imports: [NgClass, NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss',
})
export class CustomerLayout {
  customerOpen = true;
  loanServicesOpen = true;
  paymentsOpen = true;

  constructor(private auth: AuthService) {}

  toggleCustomer() { this.customerOpen = !this.customerOpen; }
  toggleLoanServices() { this.loanServicesOpen = !this.loanServicesOpen; }
  togglePayments() { this.paymentsOpen = !this.paymentsOpen; }

  logout() {
    this.auth.logout();
  }
}