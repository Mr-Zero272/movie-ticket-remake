import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShowingDragDropComponent } from './add-showing-drag-drop.component';

describe('AddShowingDragDropComponent', () => {
  let component: AddShowingDragDropComponent;
  let fixture: ComponentFixture<AddShowingDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShowingDragDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShowingDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
