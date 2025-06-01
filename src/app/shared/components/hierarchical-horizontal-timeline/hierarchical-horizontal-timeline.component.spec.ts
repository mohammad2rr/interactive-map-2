import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalHorizontalTimelineComponent } from './hierarchical-horizontal-timeline.component';

describe('HierarchicalHorizontalTimelineComponent', () => {
  let component: HierarchicalHorizontalTimelineComponent;
  let fixture: ComponentFixture<HierarchicalHorizontalTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HierarchicalHorizontalTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HierarchicalHorizontalTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
