
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScorecardService } from '../../services/scoreboard.service';

@Component({
  selector: 'app-scorecard-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoreboard-index.html',
  styleUrl: './scoreboard-index.scss'
})
export class ScorecardIndex implements OnInit {

  customers: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private scorecardService: ScorecardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.scorecardService.getAllCustomers().subscribe({
      next: (response: any) => {
        console.log('Customers API response:', response);

        this.customers = Array.isArray(response?.data)
          ? response.data
          : [];

        this.loading = false;

        console.log('Customers loaded:', this.customers);
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error('Error loading customers:', error);

        this.errorMessage = 'Unable to load customers.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  // Generate the scorecard and then navigate to its details page.
  generateScorecard(customerId: number): void {
    if (!customerId || customerId <= 0) {
      this.errorMessage = 'Invalid customer ID.';
      return;
    }

    this.scorecardService.generateScorecard(customerId).subscribe({
      next: (response: any) => {
        console.log('Scorecard generated:', response);

        if (response?.success === false) {
          this.errorMessage =
            response?.message ?? 'Failed to generate scorecard.';
          this.cdr.detectChanges();
          return;
        }

        // Navigate only after successful generation.
        this.router.navigate(['/scoreboard-details', customerId]);
      },

      error: (error: any) => {
        console.error('Error generating scorecard:', error);

        this.errorMessage =
          error?.error?.message ?? 'Failed to generate scorecard.';

        this.cdr.detectChanges();
      }
    });
  }

  // Optional method for navigating to an existing scorecard.
  viewScoreCard(customerId: number): void {
    this.router.navigate(['/scoreboard-details', customerId]);
  }
}
