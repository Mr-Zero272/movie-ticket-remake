import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShowingDragDropComponent } from './edit-showing-drag-drop.component';

describe('EditShowingDragDropComponent', () => {
  let component: EditShowingDragDropComponent;
  let fixture: ComponentFixture<EditShowingDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditShowingDragDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShowingDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
