
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenaltyService } from '../../../services/penalty';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-my-penalties',
  templateUrl: './my-penalties.html',
  styleUrl: './my-penalties.scss'
})
export class MyPenalties implements OnInit {
  constructor(
    private service: PenaltyService,
    private cd: ChangeDetectorRef
  ) {}

  penalties: any[] = [];
  loading: boolean = false;
  payingPenaltyId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit() {
    this.loadPenalties();
  }

  loadPenalties() {
    this.loading = true;
    this.errorMessage = '';

    this.service.getMyPenalties().subscribe({
      next: (response: any) => {
        this.penalties = response;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load your penalties.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  payPenalty(penaltyId: number) {
    if (this.payingPenaltyId !== null) {
      return;
    }

    if (!confirm('Are you sure you want to pay this penalty?')) {
      return;
    }

    this.payingPenaltyId = penaltyId;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.payPenalty(penaltyId).subscribe({
      next: () => {
        this.payingPenaltyId = null;
        this.successMessage = 'Penalty payment recorded successfully.';
        this.loadPenalties();
      },
      error: (error) => {
        this.payingPenaltyId = null;
        this.errorMessage =
          error.error?.message || 'Unable to pay this penalty.';
        this.cd.detectChanges();
      }
    });
  }

  raiseTicket(penalty: any) {
    alert('Support ticket integration is not connected yet.');
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-success';
      case 'pending':
        return 'bg-danger';
      case 'waived':
      case 'waived off':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    return status?.toLowerCase() === 'waived' ? 'Waived Off' : status;
  }
}
