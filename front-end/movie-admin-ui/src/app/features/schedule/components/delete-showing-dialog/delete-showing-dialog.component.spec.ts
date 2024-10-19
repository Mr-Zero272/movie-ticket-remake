import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteShowingDialogComponent } from './delete-showing-dialog.component';

describe('DeleteShowingDialogComponent', () => {
  let component: DeleteShowingDialogComponent;
  let fixture: ComponentFixture<DeleteShowingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteShowingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteShowingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
