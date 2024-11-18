import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGenreDialogComponent } from './delete-genre-dialog.component';

describe('DeleteGenreDialogComponent', () => {
  let component: DeleteGenreDialogComponent;
  let fixture: ComponentFixture<DeleteGenreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGenreDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteGenreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
