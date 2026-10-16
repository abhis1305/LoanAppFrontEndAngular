import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanAccountDetails } from './loan-account-details';

describe('LoanAccountDetails', () => {
  let component: LoanAccountDetails;
  let fixture: ComponentFixture<LoanAccountDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanAccountDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanAccountDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
