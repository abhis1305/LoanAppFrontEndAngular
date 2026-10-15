import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officer-dashboard.html',
  styleUrl: './officer-dashboard.css',
})
export class OfficerDashboard {
  customerOpen = true;
  loanProcessingOpen = false;
  requestsOpen = false;

  selectedSection = 'Dashboard';

  constructor(private router: Router) {}

  toggleCustomer(): void {
    this.customerOpen = !this.customerOpen;
  }

  toggleLoanProcessing(): void {
    this.loanProcessingOpen = !this.loanProcessingOpen;
  }

  toggleRequests(): void {
    this.requestsOpen = !this.requestsOpen;
  }

  showSection(section: string): void {
    this.selectedSection = section;
  }

  // Open existing Officer KYC page
  openKycVerification(): void {
    this.router.navigate(['/officer-kyc']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');

    this.router.navigate(['/login']);
  }
}
