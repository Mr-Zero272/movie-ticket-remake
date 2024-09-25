import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectImageItemComponent } from './select-image-item.component';

describe('SelectImageItemComponent', () => {
  let component: SelectImageItemComponent;
  let fixture: ComponentFixture<SelectImageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectImageItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectImageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
