import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairOrderDetails } from './repair-order-details';

describe('RepairOrderDetails', () => {
  let component: RepairOrderDetails;
  let fixture: ComponentFixture<RepairOrderDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairOrderDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairOrderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
