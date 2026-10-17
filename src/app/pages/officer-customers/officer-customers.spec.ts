import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficerCustomers } from './officer-customers';

describe('OfficerCustomers', () => {
  let component: OfficerCustomers;
  let fixture: ComponentFixture<OfficerCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerCustomers],
    }).compileComponents();

    fixture = TestBed.createComponent(OfficerCustomers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
