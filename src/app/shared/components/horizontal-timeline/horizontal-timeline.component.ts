import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TimelineEvent {
  title: string;
  date?: string;
  description?: string;
  icon?: string;
  color?: string;
  completed?: boolean;
}

@Component({
  selector: 'app-horizontal-timeline',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './horizontal-timeline.component.html',
  styleUrl: './horizontal-timeline.component.scss'
})
export class HorizontalTimelineComponent {
  @Input() events: TimelineEvent[] = [];
  @Input() activeIndex: number = 0;
  @Input() align: 'top' | 'bottom' = 'top';
  @Input() responsive: boolean = true;
  @Input() showConnector: boolean = true;
  @Input() connectorColor: string = '#dee2e6';
  
  @Output() eventClick = new EventEmitter<TimelineEvent>();
  @Output() activeIndexChange = new EventEmitter<number>();

  onEventClick(event: TimelineEvent, index: number): void {
    this.activeIndex = index;
    this.activeIndexChange.emit(index);
    this.eventClick.emit(event);
  }

  trackByFn(index: number, item: TimelineEvent): string {
    return item.title + index;
  }
}