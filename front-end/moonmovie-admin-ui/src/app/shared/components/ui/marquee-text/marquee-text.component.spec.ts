import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueeTextComponent } from './marquee-text.component';

describe('MarqueeTextComponent', () => {
  let component: MarqueeTextComponent;
  let fixture: ComponentFixture<MarqueeTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarqueeTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarqueeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
