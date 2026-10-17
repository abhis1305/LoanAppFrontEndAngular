import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficerForeclosure } from './officer-foreclosure';

describe('OfficerForeclosure', () => {
  let component: OfficerForeclosure;
  let fixture: ComponentFixture<OfficerForeclosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerForeclosure],
    }).compileComponents();

    fixture = TestBed.createComponent(OfficerForeclosure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
