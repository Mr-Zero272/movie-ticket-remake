import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrailerComponent } from './edit-trailer.component';

describe('EditTrailerComponent', () => {
  let component: EditTrailerComponent;
  let fixture: ComponentFixture<EditTrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrailerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
