import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectImagesComponent } from './select-images.component';

describe('SelectImagesComponent', () => {
  let component: SelectImagesComponent;
  let fixture: ComponentFixture<SelectImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
