import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { ScoreCardService, ScoreCardCustomer } from '../../services/score-card-service';
import {
  CustomerProfileService,
  CustomerProfileDto,
  UpdateCustomerProfileDto,
} from '../../services/customer-profile-service';

import { KycService, KycDocument } from '../../services/kyc-service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit, OnDestroy {
  profile: CustomerProfileDto | null = null;
  kycDocuments: KycDocument[] = [];

  isLoading = false;
  isLoadingKyc = false;
  isEditing = false;
  isSaving = false;
  scoreCard: ScoreCardCustomer | null = null;
  isLoadingScoreCard = false;
  scoreCardErrorMessage = '';

  errorMessage = '';
  successMessage = '';
  kycErrorMessage = '';

  private activeDocumentUrl: string | null = null;

  editForm: UpdateCustomerProfileDto = this.emptyForm();

  constructor(
    private profileService: CustomerProfileService,
    private kycService: KycService,
    private scoreCardService: ScoreCardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadKycDocuments();
  }

  ngOnDestroy(): void {
    if (this.activeDocumentUrl) {
      URL.revokeObjectURL(this.activeDocumentUrl);
      this.activeDocumentUrl = null;
    }
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.profileService
      .getMyProfile()
      .pipe(
        timeout({ first: 15000 }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response: any) => {
          const data = response?.data ?? response;

          if (!data || typeof data !== 'object') {
            this.profile = null;
            this.errorMessage = 'Profile response is empty or invalid.';
            return;
          }

          this.profile = this.mapProfile(data);
          this.editForm = this.mapToEditForm(this.profile);

          this.loadScoreCard();

          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('PROFILE API ERROR:', error);
          this.errorMessage = this.getErrorMessage(error);
          this.cdr.detectChanges();
        },
      });
  }

  loadScoreCard(): void {
    if (!this.profile?.email) {
      this.scoreCard = null;
      this.scoreCardErrorMessage = 'Customer email is not available in the profile.';
      return;
    }

    this.isLoadingScoreCard = true;
    this.scoreCardErrorMessage = '';
    this.scoreCard = null;

    this.scoreCardService
      .getCustomers()
      .pipe(
        timeout({ first: 15000 }),
        finalize(() => {
          this.isLoadingScoreCard = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response?.success || !Array.isArray(response.data)) {
            this.scoreCardErrorMessage = 'Invalid Score Card API response.';
            return;
          }

          const profileEmail = this.profile?.email?.trim().toLowerCase();

          const customer = response.data.find(
            (item) => item.email?.trim().toLowerCase() === profileEmail,
          );

          if (!customer) {
            this.scoreCardErrorMessage =
              'Your customer record was not found in the Score Card API.';
            return;
          }

          this.scoreCard = customer;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('SCORE CARD API ERROR:', error);
          this.scoreCardErrorMessage = this.getErrorMessage(error);
        },
      });
  }

  editProfile(): void {
    if (!this.profile) {
      return;
    }

    this.editForm = this.mapToEditForm(this.profile);
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  saveProfile(): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.profileService
      .updateMyProfile(this.editForm)
      .pipe(
        timeout({ first: 15000 }),
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('PROFILE UPDATE RESPONSE:', response);

          const data = response?.data ?? response;

          if (!data || typeof data !== 'object') {
            this.errorMessage = 'Profile update response is invalid.';
            return;
          }

          this.profile = this.mapProfile(data);
          this.editForm = this.mapToEditForm(this.profile);
          this.isEditing = false;
          this.successMessage = response?.message ?? 'Profile updated successfully.';
        },

        error: (error: any) => {
          console.error('PROFILE UPDATE ERROR:', error);
          this.errorMessage = this.getErrorMessage(error);
        },
      });
  }
  cancelEdit(): void {
    if (this.profile) {
      this.editForm = this.mapToEditForm(this.profile);
    }

    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  loadKycDocuments(): void {
    this.isLoadingKyc = true;
    this.kycErrorMessage = '';

    this.kycService
      .getMyDocuments()
      .pipe(
        timeout({ first: 15000 }),
        finalize(() => {
          this.isLoadingKyc = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('MY KYC DOCUMENTS RESPONSE:', response);

          const result = response?.data ?? response;

          const documents = Array.isArray(result)
            ? result
            : (result?.documents ?? result?.Documents ?? result?.items ?? result?.Items);

          if (!Array.isArray(documents)) {
            this.kycDocuments = [];
            this.kycErrorMessage = 'The KYC response does not contain a document list.';
            return;
          }

          this.kycDocuments = documents.map((doc: any) => ({
            documentId: this.toDocumentId(doc.documentId ?? doc.DocumentId ?? doc.id ?? doc.Id),
            customerId: doc.customerId ?? doc.CustomerId,
            documentType:
              doc.documentType ??
              doc.DocumentType ??
              doc.documentName ??
              doc.DocumentName ??
              'Document',
            fileName: doc.fileName ?? doc.FileName ?? '',
            status:
              doc.status ??
              doc.Status ??
              doc.verificationStatus ??
              doc.VerificationStatus ??
              'Pending',
            rejectionReason: doc.rejectionReason ?? doc.RejectionReason ?? null,
            uploadedAt: doc.uploadedAt ?? doc.UploadedAt,
            message: doc.message ?? doc.Message,
          }));

          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('MY KYC DOCUMENTS ERROR:', error);
          this.kycErrorMessage = this.getErrorMessage(error);
          this.cdr.detectChanges();
        },
      });
  }

  getKycStatusClass(status?: string): string {
    switch ((status ?? '').toLowerCase()) {
      case 'approved':
        return 'text-bg-success';
      case 'rejected':
        return 'text-bg-danger';
      case 'pending':
        return 'text-bg-warning';
      default:
        return 'text-bg-secondary';
    }
  }

  openKycDocument(documentId?: number): void {
    if (documentId == null || !Number.isFinite(documentId) || documentId <= 0) {
      this.kycErrorMessage = 'A valid document ID is not available.';
      return;
    }

    const documentWindow = window.open('about:blank', '_blank');

    if (!documentWindow) {
      this.kycErrorMessage = 'The browser blocked the new tab. Allow pop-ups and try again.';
      return;
    }

    this.kycErrorMessage = '';

    this.kycService.viewMyDocument(documentId).subscribe({
      next: (file: Blob) => {
        if (!file || file.size === 0) {
          documentWindow.close();
          this.kycErrorMessage = 'The document file is empty.';
          this.cdr.detectChanges();
          return;
        }

        if (this.activeDocumentUrl) {
          URL.revokeObjectURL(this.activeDocumentUrl);
        }

        this.activeDocumentUrl = URL.createObjectURL(file);
        documentWindow.location.href = this.activeDocumentUrl;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        documentWindow.close();
        console.error('KYC DOCUMENT VIEW ERROR:', error);
        this.kycErrorMessage = this.getErrorMessage(error);
        this.cdr.detectChanges();
      },
    });
  }

  private toDocumentId(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const id = Number(value);
    return Number.isFinite(id) && id > 0 ? id : undefined;
  }

  private mapProfile(data: any): CustomerProfileDto {
    const firstName = data.firstName ?? data.FirstName ?? '';
    const lastName = data.lastName ?? data.LastName ?? '';

    return {
      userId: data.userId ?? data.UserId ?? 0,
      firstName,
      lastName,
      fullName: data.fullName ?? data.FullName ?? `${firstName} ${lastName}`.trim(),
      email: data.email ?? data.Email ?? '',
      mobileNo: data.mobileNo ?? data.MobileNo ?? '',
      pan: data.pan ?? data.Pan ?? '',
      aadhaarNo: data.aadhaarNo ?? data.AadhaarNo ?? '',
      employmentType: data.employmentType ?? data.EmploymentType ?? '',
      monthlyIncome: data.monthlyIncome ?? data.MonthlyIncome ?? 0,
      monthlyInvestment: data.monthlyInvestment ?? data.MonthlyInvestment ?? 0,
      age: data.age ?? data.Age ?? 0,
    };
  }

  private mapToEditForm(profile: CustomerProfileDto): UpdateCustomerProfileDto {
    return {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      mobileNo: profile.mobileNo,
      age: profile.age,
      employmentType: profile.employmentType,
      monthlyIncome: profile.monthlyIncome,
      monthlyInvestment: profile.monthlyInvestment,
    };
  }

  private emptyForm(): UpdateCustomerProfileDto {
    return {
      firstName: '',
      lastName: '',
      email: '',
      mobileNo: '',
      age: 18,
      employmentType: 'Salaried',
      monthlyIncome: 0,
      monthlyInvestment: 0,
    };
  }

  private getErrorMessage(error: any): string {
    if (error?.name === 'TimeoutError' || error?.name === 'TimeoutErrorImpl') {
      return 'The API did not respond within 15 seconds. Check the backend and network request.';
    }

    if (error?.status === 0) {
      return 'Backend connection failed. Check the API URL and HTTPS certificate.';
    }

    if (error?.status === 400) {
      return error?.error?.message ?? 'The request details are invalid.';
    }

    if (error?.status === 401) {
      return 'The session is invalid or expired. Please log in again.';
    }

    if (error?.status === 403) {
      return 'Access denied. Check login status and API permissions.';
    }

    if (error?.status === 404) {
      return error?.error?.message ?? 'The requested data was not found.';
    }

    if (error?.status === 409) {
      return error?.error?.message ?? 'The email is already registered to another account.';
    }

    if (error?.status >= 500) {
      return error?.error?.message ?? 'The backend server returned an error.';
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    return 'The request failed. Check the browser console and Network tab.';
  }
}
