import { TestBed } from '@angular/core/testing';
import { Penalty } from './penalty';

describe('Penalty', () => {
  let service: Penalty;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Penalty);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
