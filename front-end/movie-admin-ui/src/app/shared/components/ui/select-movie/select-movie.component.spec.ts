import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMovieComponent } from './select-movie.component';

describe('SelectMovieComponent', () => {
  let component: SelectMovieComponent;
  let fixture: ComponentFixture<SelectMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
