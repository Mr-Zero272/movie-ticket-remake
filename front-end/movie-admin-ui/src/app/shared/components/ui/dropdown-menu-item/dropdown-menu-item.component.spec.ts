import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMenuItemComponent } from './dropdown-menu-item.component';

describe('DropdownMenuItemComponent', () => {
  let component: DropdownMenuItemComponent;
  let fixture: ComponentFixture<DropdownMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownMenuItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
