
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { finalize } from 'rxjs';
// import { ScorecardService } from '../../services/scoreboard.service';

// @Component({
//   selector: 'app-scorecard-details',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './scoreboard-details.html',
//   styleUrl: './scoreboard-details.scss'
// })
// export class ScorecardDetails implements OnInit {
//   scorecard: any = null;
//   loading = false;
//   errorMessage = '';
//   customerId: number | null = null;

//   constructor(
//     private readonly scorecardService: ScorecardService,
//     private readonly route: ActivatedRoute,
//     private readonly router: Router
//   ) {}

//   ngOnInit(): void {
//     const id = Number(
//       this.route.snapshot.paramMap.get('customerId')
//     );

//     if (!Number.isInteger(id) || id <= 0) {
//       this.errorMessage = 'Invalid customer ID.';
//       return;
//     }

//     this.customerId = id;
//     this.loadScorecard(id);
//   }
  
// loadScorecard(customerId: number): void {
//   this.loading = true;
//   this.errorMessage = '';
//   this.scorecard = null;

//   this.scorecardService.generateScorecard(customerId).subscribe({
//     next: (response: any) => {
//       console.log('Scorecard response:', response);

//       if (response?.success === false) {
//         this.errorMessage =
//           response?.message ?? 'Failed to generate scorecard.';
//         this.loading = false;
//         return;
//       }

//       // Extract the scorecard object from the API response.
//       const data = response?.data ?? response;

//       this.scorecard = data;

//       this.loading = false;

//       if (!this.scorecard || !this.scorecard.customerId) {
//         this.errorMessage = 'No scorecard data returned.';
//       }
//     },

//     error: (error: any) => {
//       console.error('Scorecard API error:', error);

//       this.loading = false;
//       this.errorMessage =
//         error?.error?.message ??
//         `Unable to load scorecard. HTTP ${error.status || 'error'}`;
//     }
//   });
// }


//   backToList(): void {
//     this.router.navigate(['/scorecard']);
//   }
// }



import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ScorecardService } from '../../services/scoreboard.service';

@Component({
  selector: 'app-scorecard-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './scoreboard-details.html',
  styleUrl: './scoreboard-details.scss'
})
export class ScorecardDetails implements OnInit {
  scorecard: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly scorecardService: ScorecardService
  ) {}

  ngOnInit(): void {
    const customerId = Number(
      this.route.snapshot.paramMap.get('customerId')
    );

    if (!Number.isInteger(customerId) || customerId <= 0) {
      this.errorMessage = 'Invalid customer ID.';
      return;
    }

    this.loadScorecard(customerId);
  }

  loadScorecard(customerId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.scorecard = null;

    this.scorecardService.generateScorecard(customerId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Scorecard API response:', response);

          // Support both wrapped and unwrapped API responses.
          const data = response?.data ?? response;

          if (response?.success === false || !data) {
            this.errorMessage =
              response?.message || 'Unable to generate scorecard.';
            return;
          }

          this.scorecard = data;

          console.log(
            'Scorecard assigned to frontend:',
            this.scorecard
          );
        },

        error: (error: any) => {
          console.error('Scorecard API error:', error);

          this.errorMessage =
            error?.error?.message ||
            `Failed to load scorecard. HTTP ${error.status || 'unknown error'}`;
        }
      });
  }

  backToList(): void {
    this.router.navigate(['/scoreboard']);
  }
}
