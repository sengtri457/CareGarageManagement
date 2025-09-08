import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairorderList } from './repairorder-list';

describe('RepairorderList', () => {
  let component: RepairorderList;
  let fixture: ComponentFixture<RepairorderList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairorderList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairorderList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
