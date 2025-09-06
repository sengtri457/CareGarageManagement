import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairOrders } from './repair-orders';

describe('RepairOrders', () => {
  let component: RepairOrders;
  let fixture: ComponentFixture<RepairOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
