import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAuditoriumComponent } from './select-auditorium.component';

describe('SelectAuditoriumComponent', () => {
  let component: SelectAuditoriumComponent;
  let fixture: ComponentFixture<SelectAuditoriumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAuditoriumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAuditoriumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
