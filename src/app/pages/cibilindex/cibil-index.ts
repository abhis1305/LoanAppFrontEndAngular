import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { cibilapiService } from '../../services/cibil-api';

@Component({
  selector: 'app-cibil-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cibil-index.html',
  styleUrl: './cibil-index.scss'
})
export class CibilIndex implements OnInit {
  private auth = inject(AuthService);
  private api = inject(cibilapiService);
  private router = inject(Router);

  customerId = 0;
  customerName = '';
  panNo = '';
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.customerId = this.auth.getCustomerId();

    if (this.customerId <= 0) {
      this.loading = false;
      this.errorMessage = 'Customer ID not found. Please log in again.';
      return;
    }

    // Load the customer's name and PAN from your customer API here.
    // The exact endpoint depends on your existing CustomerController.
    this.loading = false;
  }

  checkScore(): void {
    if (this.customerId <= 0) {
      this.errorMessage = 'Invalid customer ID. Please log in again.';
      return;
    }

    void this.router.navigate(['/cibil/check-score']);
  }
}