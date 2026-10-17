import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cibilindex } from './cibilindex';

describe('Cibilindex', () => {
  let component: Cibilindex;
  let fixture: ComponentFixture<Cibilindex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cibilindex],
    }).compileComponents();

    fixture = TestBed.createComponent(Cibilindex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
