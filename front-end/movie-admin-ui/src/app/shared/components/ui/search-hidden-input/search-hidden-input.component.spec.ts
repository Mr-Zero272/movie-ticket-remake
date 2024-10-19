import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHiddenInputComponent } from './search-hidden-input.component';

describe('SearchHiddenInputComponent', () => {
  let component: SearchHiddenInputComponent;
  let fixture: ComponentFixture<SearchHiddenInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHiddenInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchHiddenInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
