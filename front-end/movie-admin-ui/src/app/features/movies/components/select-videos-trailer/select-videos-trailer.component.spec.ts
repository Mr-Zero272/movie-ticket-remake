import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVideosTrailerComponent } from './select-videos-trailer.component';

describe('SelectVideosTrailerComponent', () => {
  let component: SelectVideosTrailerComponent;
  let fixture: ComponentFixture<SelectVideosTrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectVideosTrailerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectVideosTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
