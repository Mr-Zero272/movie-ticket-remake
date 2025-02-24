import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHallDialogComponent } from './edit-hall-dialog.component';

describe('EditHallDialogComponent', () => {
  let component: EditHallDialogComponent;
  let fixture: ComponentFixture<EditHallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHallDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
