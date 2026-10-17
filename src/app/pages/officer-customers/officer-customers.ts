import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ScoreCardService, ScoreCardCustomer } from '../../services/score-card-service';
import { KycService, KycDocument } from '../../services/kyc-service';

interface CustomerRow extends ScoreCardCustomer {
  kycStatus: string;
  kycDate: string;
  documents: KycDocument[];
  documentsLoaded: boolean;
  loadingDocuments: boolean;
}

@Component({
  selector: 'app-officer-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officer-customers.html',
  styleUrl: './officer-customers.css',
})
export class OfficerCustomers implements OnInit {
  private scoreCardService = inject(ScoreCardService);
  private kycService = inject(KycService);
  private cd = inject(ChangeDetectorRef);

  customers: CustomerRow[] = [];
  loading = false;
  errorMessage = '';
  selectedCustomerId: number | null = null;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cd.detectChanges();

    this.scoreCardService
      .getCustomers()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Customers API response:', response);

          const list: ScoreCardCustomer[] = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
              ? response.data
              : [];

          if (!Array.isArray(list) || list.length === 0) {
            this.customers = [];
            this.errorMessage = 'No customers found.';
            this.cd.detectChanges();
            return;
          }

          this.customers = list.map((customer: ScoreCardCustomer) => ({
            ...customer,
            kycStatus: 'Loading...',
            kycDate: '—',
            documents: [],
            documentsLoaded: false,
            loadingDocuments: false,
          }));

          console.log('Customers assigned:', this.customers.length);
          console.log('First customer:', this.customers[0]);

          this.cd.detectChanges();

          forkJoin(
            this.customers.map((customer) =>
              this.kycService.getCustomerDocuments(customer.customerId).pipe(
                catchError((error) => {
                  console.error(
                    'KYC documents request failed for customer:',
                    customer.customerId,
                    error,
                  );
                  return of(null);
                }),
              ),
            ),
          ).subscribe({
            next: (results) => {
              results.forEach((result, index) => {
                const customer = this.customers[index];

                if (!customer) {
                  return;
                }

                if (result === null) {
                  customer.kycStatus = 'Unavailable';
                  customer.documentsLoaded = false;
                  return;
                }

                const documents = this.normalizeDocuments(result);

                customer.documents = documents;
                customer.documentsLoaded = true;
                customer.kycStatus = this.getKycStatus(documents);
                customer.kycDate = this.getLatestUploadDate(documents);
              });

              this.cd.detectChanges();
            },
            error: (error) => {
              console.error('Unable to process customer documents:', error);
              this.cd.detectChanges();
            },
          });
        },
        error: (error) => {
          console.error('Unable to load customers:', error);
          this.customers = [];
          this.errorMessage = 'Customers load nahi hue. API aur login token check karo.';
          this.cd.detectChanges();
        },
      });
  }

  private normalizeDocuments(response: unknown): KycDocument[] {
    if (Array.isArray(response)) {
      return response as KycDocument[];
    }

    if (response && typeof response === 'object') {
      const data = response as {
        data?: unknown;
        documents?: unknown;
      };

      if (Array.isArray(data.data)) {
        return data.data as KycDocument[];
      }

      if (Array.isArray(data.documents)) {
        return data.documents as KycDocument[];
      }
    }

    return [];
  }

  private getKycStatus(documents: KycDocument[]): string {
    if (documents.length === 0) {
      return 'Not Submitted';
    }

    const statuses = documents.map((document) => (document.status ?? '').toLowerCase());

    if (statuses.some((status) => status.includes('reject'))) {
      return 'Rejected';
    }

    if (statuses.every((status) => status.includes('approv'))) {
      return 'Approved';
    }

    return 'Pending';
  }

  private getLatestUploadDate(documents: KycDocument[]): string {
    const dates = documents
      .map((document) => document.uploadedAt)
      .filter((date): date is string => !!date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (dates.length === 0) {
      return '—';
    }

    const parsedDate = new Date(dates[0]);

    return Number.isNaN(parsedDate.getTime()) ? '—' : parsedDate.toLocaleDateString('en-IN');
  }

  toggleDocuments(customer: CustomerRow): void {
    if (this.selectedCustomerId === customer.customerId) {
      this.selectedCustomerId = null;
      this.cd.detectChanges();
      return;
    }

    this.selectedCustomerId = customer.customerId;

    if (customer.documentsLoaded || customer.kycStatus === 'Unavailable') {
      this.cd.detectChanges();
      return;
    }

    customer.loadingDocuments = true;
    this.cd.detectChanges();

    this.kycService
      .getCustomerDocuments(customer.customerId)
      .pipe(
        catchError((error) => {
          console.error('Unable to load customer documents:', error);
          return of(null);
        }),
        finalize(() => {
          customer.loadingDocuments = false;
          this.cd.detectChanges();
        }),
      )
      .subscribe((response) => {
        if (response === null) {
          customer.kycStatus = 'Unavailable';
          return;
        }

        customer.documents = this.normalizeDocuments(response);
        customer.documentsLoaded = true;
        customer.kycStatus = this.getKycStatus(customer.documents);
        customer.kycDate = this.getLatestUploadDate(customer.documents);

        this.cd.detectChanges();
      });
  }

  trackByCustomerId(index: number, customer: CustomerRow): number {
    return customer.customerId;
  }
}
