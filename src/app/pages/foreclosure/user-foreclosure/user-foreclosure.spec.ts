import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserForeclosure } from './user-foreclosure';

describe('UserForeclosure', () => {
  let component: UserForeclosure;
  let fixture: ComponentFixture<UserForeclosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserForeclosure],
    }).compileComponents();

    fixture = TestBed.createComponent(UserForeclosure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
