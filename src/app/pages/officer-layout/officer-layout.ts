import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officer-layout.html',
  styleUrl: './officer-layout.scss',
})
export class OfficerLayout {
  // Sidebar sections
  customerOpen = true;
  loanProcessingOpen = false;
  requestsOpen = false;

  // Currently selected sidebar section
  selectedSection = 'Dashboard';

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

  // Select a dashboard section
  showSection(section: string): void {
    this.selectedSection = section;
  }

  // Navigate to Officer KYC Verification
  openKycVerification(): void {
    this.router.navigate(['/officer-kyc']);
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
