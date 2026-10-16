import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import {
  ChangeDetectorRef
} from '@angular/core';

import { AuthService } from '../../services/auth-service';
import { cibilapiService } from '../../services/cibil-api';

@Component({
  selector: 'app-cibil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cibil.html',
  styleUrl: './cibil.scss'
})
export class Cibil implements OnInit {

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private cibilService = inject(cibilapiService);

  customerId = 0;
  cibil: any = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.customerId = this.authService.getCustomerId();

    if (!this.customerId || this.customerId <= 0) {
      this.errorMessage = 'Customer ID not found. Please log in again.';
      return;
    }

    // Generate CIBIL directly using POST.
    this.checkScore();
  }

  checkScore(): void {
  if (this.loading) return;

  if (!this.customerId || this.customerId <= 0) {
    this.errorMessage = 'Invalid customer ID. Please log in again.';
    return;
  }

  this.loading = true;
  this.errorMessage = '';
  this.cibil = null;

  this.cibilService.generateCibil(this.customerId)
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (response: any) => {
        console.log('CIBIL API response:', response);

        this.cibil = response?.data ?? response;

        console.log('CIBIL report displayed:', this.cibil);

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('CIBIL generation failed:', error);

        this.errorMessage =
          error?.error?.message ||
          `CIBIL generation failed (HTTP ${error.status}).`;

        this.cdr.detectChanges();
      }
    });
}

  get scoreColor(): string {
    const score = Number(this.cibil?.cibilScore);

    if (score >= 750) return '#198754';
    if (score >= 650) return '#fd7e14';
    if (score > 0) return '#dc3545';

    return '#212529';
  }
}