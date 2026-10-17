
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanAccountService } from '../../services/loan-account-service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-loan-account',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './loan-account.html',
  styleUrl: './loan-account.css'
})
export class LoanAccount implements OnInit {

  service = inject(LoanAccountService);
  router = inject(Router);

  allLoanAccounts: any = [];

  // Search and filter
  searchText: string = '';
  selectedStatus: string = '';

  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  ngOnInit() {
    this.getAllLoanAccounts();
  }

  getAllLoanAccounts() {
    this.service.getLoanAccounts().subscribe({
      next: res => {
        console.log(res);
        this.allLoanAccounts = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  goToDetails(id: any) {
  this.router.navigate(['/loan-account-details', id]);
}

  get filteredLoanAccounts() {
    return this.allLoanAccounts.filter((account: any) => {
      const matchesSearch = (account.loanAccountNo || '')
        .toString()
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.selectedStatus === '' ||
        account.loanStatus === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get paginatedLoanAccounts() {
    const start = (this.pageNumber - 1) * this.pageSize;
    return this.filteredLoanAccounts.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredLoanAccounts.length / this.pageSize);
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
    }
  }

  changePageSize(size: number) {
  this.pageSize = size;
  this.pageNumber = 1;
}

  resetPage() {
    this.pageNumber = 1;
  }
}
