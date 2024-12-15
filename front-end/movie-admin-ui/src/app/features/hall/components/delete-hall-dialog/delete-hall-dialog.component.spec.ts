import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHallDialogComponent } from './delete-hall-dialog.component';

describe('DeleteHallDialogComponent', () => {
  let component: DeleteHallDialogComponent;
  let fixture: ComponentFixture<DeleteHallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteHallDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteHallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
