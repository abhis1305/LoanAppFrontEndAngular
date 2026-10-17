import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingDeals } from './pending-deals';

describe('PendingDeals', () => {
  let component: PendingDeals;
  let fixture: ComponentFixture<PendingDeals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingDeals],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingDeals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
