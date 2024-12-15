import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewHallDialogComponent } from './add-new-hall-dialog.component';

describe('AddNewHallDialogComponent', () => {
  let component: AddNewHallDialogComponent;
  let fixture: ComponentFixture<AddNewHallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewHallDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewHallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
