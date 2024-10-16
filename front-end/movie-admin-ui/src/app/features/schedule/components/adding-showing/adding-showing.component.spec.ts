import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingShowingComponent } from './adding-showing.component';

describe('AddingShowingComponent', () => {
  let component: AddingShowingComponent;
  let fixture: ComponentFixture<AddingShowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddingShowingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddingShowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
