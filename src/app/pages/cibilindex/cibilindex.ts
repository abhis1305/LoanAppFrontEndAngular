
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import {
  cibilapiService,
  CibilProfileResponse
} from '../../services/cibil-api';

@Component({
  selector: 'app-cibil-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cibilindex.html',
  styleUrl: './cibilindex.scss'
})
export class CibilIndexComponent implements OnInit {

  customerId: number | null = null;
  customerName = '';
  panNumber = '';

  profileLoading = false;
  loading = false;

  message = '';
  cibilResult: any = null;

  constructor(
    private cibilService: cibilapiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomerProfile();
  }

  loadCustomerProfile(): void {
    this.profileLoading = true;
    this.message = '';
    this.customerId = null;
    this.customerName = '';
    this.panNumber = '';

    this.cibilService.getCustomerProfile()
      .pipe(
        finalize(() => {
          this.profileLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: CibilProfileResponse) => {
          console.log('CIBIL profile response:', response);

          // Supports { message, data: {...} } and a direct profile response.
          const profile: any = response?.data ?? response;

          if (profile?.customerId == null) {
            this.message =
              response?.message ??
              'Customer profile data is missing.';
            return;
          }

          this.customerId = Number(profile.customerId);
          this.customerName = profile.customerName ?? '';
          this.panNumber = profile.panNumber ?? '';

          console.log('Customer ID:', this.customerId);
          console.log('Customer Name:', this.customerName);
          console.log('PAN available:', !!this.panNumber);

          this.cdr.detectChanges();
        },

        error: (error: any) => {
          console.error('CIBIL profile error:', error);

          this.message =
            error?.error?.message ??
            `Unable to load customer profile (HTTP ${error?.status ?? 'unknown'}).`;
        }
      });
  }

  checkScore(): void {
    if (this.customerId === null) {
      this.message = 'Customer profile is not available. Reload the profile and try again.';
      return;
    }

    this.loading = true;
    this.message = '';
    this.cdr.detectChanges();

    this.cibilService.generateCibil(this.customerId).subscribe({
      next: (response: any) => {
        this.cibilResult = response?.data ?? response;
        this.loading = false;
        this.cdr.detectChanges();

        this.router.navigate(['/cibil-score'], {
          state: {
            customerId: this.customerId,
            customerName: this.customerName,
            panNumber: this.panNumber,
            cibilResult: this.cibilResult
          }
        });
      },

      error: (error: any) => {
        console.error('CIBIL score request failed:', error);

        this.message =
          error?.error?.message ??
          `Unable to check CIBIL score (HTTP ${error?.status ?? 'unknown'}).`;

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
