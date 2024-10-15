import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieVerticalCardComponent } from './movie-vertical-card.component';

describe('MovieVerticalCardComponent', () => {
  let component: MovieVerticalCardComponent;
  let fixture: ComponentFixture<MovieVerticalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieVerticalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieVerticalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
