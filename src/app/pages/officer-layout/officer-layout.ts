import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-officer-layout',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './officer-layout.html',
  styleUrl: './officer-layout.scss',
})
export class OfficerLayout {
  // Sidebar sections
  customerOpen = true;
  loanProcessingOpen = true;
  requestsOpen = false;

  constructor(private router: Router) {}

  // Toggle Customer Management
  toggleCustomer(): void {
    this.customerOpen = !this.customerOpen;
  }

  // Toggle Loan Processing
  toggleLoanProcessing(): void {
    this.loanProcessingOpen = !this.loanProcessingOpen;
  }

  // Toggle Requests & Collections
  toggleRequests(): void {
    this.requestsOpen = !this.requestsOpen;
  }

  // Logout and clear authentication tokens
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('setupToken');
    sessionStorage.removeItem('preAuthToken');

    this.router.navigate(['/login']);
  }
}