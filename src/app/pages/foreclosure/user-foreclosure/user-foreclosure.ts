import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Foreclosure } from '../../../services/foreclosure';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-user-foreclosure',
  styleUrl: './user-foreclosure.scss',
  templateUrl: './user-foreclosure.html',
})
export class UserForeclosure {

  constructor(private service: Foreclosure, private cd: ChangeDetectorRef) {

  }

  loanAccounts: any;
  allForeclosureRequests: any;

  loanAccountId: number = 0;
  foreclosureType: string = 'Full';
  foreclosureAmount: number = 0;
  expectedClosureDate: string = '';
  reason: string = '';

  submitting: boolean = false;

}