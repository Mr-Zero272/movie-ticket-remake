import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieHorizontalCardComponent } from './movie-horizontal-card.component';

describe('MovieHorizontalCardComponent', () => {
  let component: MovieHorizontalCardComponent;
  let fixture: ComponentFixture<MovieHorizontalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieHorizontalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieHorizontalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
