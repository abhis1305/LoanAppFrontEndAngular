import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SanctionLetterService } from '../../services/sanction-letter';
import { DisbursementServices } from '../../services/disbursement';

@Component({
  imports: [CommonModule,FormsModule],
  selector: 'app-sanction-letter',
  styleUrl: './sanction-letter.scss',
  templateUrl: './sanction-letter.html',
})
export class SanctionLetter {

  loans: any ;
  selectedLoan: any = null;
  disbursements: any = null;


constructor(private service: SanctionLetterService,private disbursementService:DisbursementServices) {
  this.GetApprovedLoans();
  this.GetDisbursements();
}

  GetApprovedLoans() {
    this.service.GetApprovedLoans().subscribe({
      next: (res: any) => {
        this.loans = res.data || res;
        console.log(this.loans);
      },
      error: (err: any) => {
        console.log(err);
        alert('Failed to load approved loans.');
      }
    });
  }

  

OnCustomerChange(event: Event) {
  const dealId = Number((event.target as HTMLSelectElement).value);

  this.selectedLoan = this.loans.find(
    (l: any) => l.dealId === dealId
  ) || null;
}

  GenerateSanctionLetter(dealId: number) {
  if (!confirm('Generate sanction letter and send email?')) {
    return;
  }


  this.service.GenerateSanctionLetter(dealId).subscribe({
    next: (res: any) => {
  alert('Sanction Letter generated successfully and email sent!');
  this.CloseGenerateModal();
  this.GetApprovedLoans();
},
    error: (err: any) => {
      console.log(err);
      alert(
        err.error?.message ||
        'Failed to generate sanction letter.'
      );
    }
  });
}


CloseGenerateModal() {
  const modalElement = document.getElementById('generateModal');

  if (modalElement && (window as any).bootstrap) {
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }
}

  ViewSanctionLetter(dealId: number) {
    this.service.GetSanctionLetter(dealId).subscribe({
      next: (res: any) => {
        console.log('Sanction Letter Details:', res);
        alert('Sanction letter details loaded. Check console.');
      },
      error: (err: any) => {
        console.log(err);
        alert(err.error?.message || 'Sanction letter not found.');
      }
    });
  }

  ViewPdf(dealId: number) {
  this.service.ViewSanctionLetterPdf(dealId);
}

DownloadPdf(dealId: number) {
  this.service.DownloadSanctionLetterPdf(dealId);
}



disbursement = {
  dealId: 0,
  disburseAmount: 0,
  disbursementDate: new Date().toISOString().substring(0, 10),
  bankPartner: ''
};

GetDisbursements() {
  this.disbursementService.GetAll().subscribe({
    next: (res: any) => {
      this.disbursements = res;
    },
    error: (err: any) => console.log(err)
  });
}

OpenDisbursement(loan: any) {
  this.selectedLoan = loan;

  this.disbursement = {
    dealId: loan.dealId,
    disburseAmount: loan.approvedAmount,
    disbursementDate: new Date().toISOString().substring(0, 10),
    bankPartner: ''
  };
}

SubmitDisbursement() {
  if (!this.disbursement.bankPartner) {
    alert('Select Bank Partner.');
    return;
  }

  this.disbursementService.Create(this.disbursement).subscribe({
    next: () => {
  alert('Loan disbursed successfully!');

  this.GetDisbursements();
  this.GetApprovedLoans();

  const modalElement = document.getElementById('disbursementModal');

  if (modalElement && (window as any).bootstrap) {
    (window as any).bootstrap.Modal
      .getInstance(modalElement)?.hide();
  }
},
 
});
}



}

