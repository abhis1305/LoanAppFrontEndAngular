import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficerForeclosureService } from '../../../services/officer-foreclosure';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-officer-foreclosure',
  styleUrl: './officer-foreclosure.scss',
  templateUrl: './officer-foreclosure.html',
})
export class OfficerForeclosure implements OnInit {
  constructor(
    private service: OfficerForeclosureService,
    private cd: ChangeDetectorRef
  ) {}

  allForeclosureRequests: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  actionMessage: string = '';

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.errorMessage = '';

    this.service.getAllRequests().subscribe({
      next: (response: any) => {
        this.allForeclosureRequests = response;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Unable to load foreclosure requests.';
        this.cd.detectChanges();
      }
    });
  }

  approveRequest(requestId: number) {
    if (!confirm('Are you sure you want to approve this foreclosure request?')) {
      return;
    }

    this.service.approveRequest(requestId).subscribe({
      next: (response: any) => {
        this.actionMessage = response.message || 'Request approved.';
        this.loadRequests();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Unable to approve request.';
        this.cd.detectChanges();
      }
    });
  }

  rejectRequest(requestId: number) {
    if (!confirm('Are you sure you want to reject this foreclosure request?')) {
      return;
    }

    this.service.rejectRequest(requestId).subscribe({
      next: (response: any) => {
        this.actionMessage = response.message || 'Request rejected.';
        this.loadRequests();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Unable to reject request.';
        this.cd.detectChanges();
      }
    });
  }
}