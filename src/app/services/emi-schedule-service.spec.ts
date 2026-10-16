import { TestBed } from '@angular/core/testing';
import { EmiScheduleService } from './emi-schedule-service';

describe('EmiScheduleService', () => {
  let service: EmiScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmiScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
