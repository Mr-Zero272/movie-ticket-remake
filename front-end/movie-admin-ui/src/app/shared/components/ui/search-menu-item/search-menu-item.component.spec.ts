import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMenuItemComponent } from './search-menu-item.component';

describe('SearchMenuItemComponent', () => {
  let component: SearchMenuItemComponent;
  let fixture: ComponentFixture<SearchMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMenuItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
