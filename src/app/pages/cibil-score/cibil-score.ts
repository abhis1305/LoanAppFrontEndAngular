
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cibilapiService } from '../../services/cibil-api';

@Component({
  selector: 'app-cibil-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cibil-score.html',
  styleUrl: './cibil-score.scss'
})
export class CibilScoreComponent implements OnInit {

  customerId: number | null = null;
  customerName = '';
  panNumber = '';

  refereshScore(): void{this.loadProfileAndScore()}

  cibilScore: number | null = null;
  cibilStatus = '';
  lastCheckedDate = '';

  loading = true;
  message = '';

  constructor(
    private cibilService: cibilapiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const state = history.state;

    this.customerId = Number(state?.customerId) || null;
    this.customerName = state?.customerName ?? '';
    this.panNumber = state?.panNumber ?? '';

    const result = state?.cibilResult;

    if (result && typeof result === 'object') {
      this.displayScore(result);
      this.loading = false;
    } else {
      this.loadProfileAndScore();
    }
  }

  private displayScore(result: any): void {
    this.cibilScore =
      result?.cibilScore ?? result?.score ?? null;

    this.cibilStatus =
      result?.cibilStatus ?? result?.status ?? '';

    const date =
      result?.checkDate ??
      result?.lastCheckedDate ??
      result?.checkedDate ??
      result?.createdAt;

    this.lastCheckedDate = date
      ? new Date(date).toLocaleString()
      : '';

    if (this.cibilScore === null) {
      this.message = 'No CIBIL score was returned by the API.';
    }
  }

  private loadProfileAndScore(): void {
    this.cibilService.getCustomerProfile().subscribe({
      next: (response) => {
        const profile = response?.data;

        if (!profile?.customerId) {
          this.message = 'Customer profile not found.';
          this.loading = false;
          return;
        }

        this.customerId = Number(profile.customerId);
        this.customerName = profile.customerName ?? '';
        this.panNumber = profile.panNumber ?? '';

        this.loadExistingScore();
      },
      error: (error: any) => {
        console.error('Profile error:', error);
        this.message = 'Unable to load customer profile.';
        this.loading = false;
      }
    });
  }

  private loadExistingScore(): void {
    if (this.customerId === null) {
      this.message = 'Customer ID is unavailable.';
      this.loading = false;
      return;
    }

    this.cibilService.getCibil(this.customerId).subscribe({
      next: (response: any) => {
        const result = response?.data ?? response;
        this.displayScore(result);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Existing CIBIL score error:', error);

        this.message =
          error?.error?.message ?? 'Unable to load CIBIL score.';

        this.loading = false;
      }
    });
  }

  backToCibilIndex(): void {
    this.router.navigate(['/cibil']);
  }

  refreshScore(): void {
  this.loading = true;
  this.message = '';
  this.loadProfileAndScore();
}

  get scoreColor(): string {
    if (this.cibilScore === null) return '#64748b';
    if (this.cibilScore >= 750) return '#008000';
    if (this.cibilScore >= 650) return '#d97706';
    return '#dc2626';
  }
}
