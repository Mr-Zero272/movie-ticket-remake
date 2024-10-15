import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGenreDialogComponent } from './edit-genre-dialog.component';

describe('EditGenreDialogComponent', () => {
  let component: EditGenreDialogComponent;
  let fixture: ComponentFixture<EditGenreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGenreDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGenreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
