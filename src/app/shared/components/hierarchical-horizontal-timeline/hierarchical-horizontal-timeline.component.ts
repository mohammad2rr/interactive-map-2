import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TimelineEvent {
  id?: string;
  title?: string;
  date?: string;
  description?: string;
  icon?: string;
  color?: string;
  completed?: boolean;
  children?: TimelineEvent[];
  expanded?: boolean;
  level?: number;
  parentId?: string | null;
}

@Component({
  selector: 'app-hierarchical-horizontal-timeline',
  imports: [CommonModule],
  templateUrl: './hierarchical-horizontal-timeline.component.html',
  styleUrl: './hierarchical-horizontal-timeline.component.scss'
})
export class HierarchicalHorizontalTimelineComponent {
  @Input() set events(events: TimelineEvent[]) {
    this._events = this.processEvents(events);
    this.allEvents = this.flattenEvents(this._events);
    this.updateVisibleEvents();
  }
  get events(): TimelineEvent[] {
    return this._events;
  }
  
  @Input() activeIndex: number = 0;
  @Input() align: 'top' | 'bottom' = 'top';
  @Input() responsive: boolean = true;
  @Input() showConnector: boolean = true;
  @Input() connectorColor: string = '#dee2e6';
  @Input() maxLevel: number = 3;

  @Output() eventClick = new EventEmitter<TimelineEvent>();
  @Output() activeIndexChange = new EventEmitter<number>();

  private _events: TimelineEvent[] = [];
  allEvents: TimelineEvent[] = [];
  visibleEvents: TimelineEvent[] = [];

  private processEvents(events: TimelineEvent[], level: number = 0, parentId: string | null = null): TimelineEvent[] {
    return events.map(event => {
      const id = parentId ? `${parentId}-${event.title}` : event.title;
      return {
        ...event,
        id,
        level,
        parentId,
        children: event.children ? this.processEvents(event.children, level + 1, id) : undefined,
        expanded: level === 0 ? true : false
      };
    });
  }

  private flattenEvents(events: TimelineEvent[]): TimelineEvent[] {
    let result: TimelineEvent[] = [];
    events.forEach(event => {
      result.push(event);
      if (event.children && event.expanded) {
        result = result.concat(this.flattenEvents(event.children));
      }
    });
    return result;
  }

  private updateVisibleEvents(): void {
    this.visibleEvents = this.allEvents.filter(event => 
      event.level! < this.maxLevel && 
      (event.level === 0 || this.isParentExpanded(event))
    );
  }

  private isParentExpanded(event: TimelineEvent): boolean {
    if (!event.parentId) return true;
    const parent = this.allEvents.find(e => e.id === event.parentId);
    return parent ? parent.expanded! && this.isParentExpanded(parent) : false;
  }

  onEventClick(event: TimelineEvent, index: number): void {
    if (event.children && event.children.length > 0) {
      event.expanded = !event.expanded;
      this.allEvents = this.flattenEvents(this._events);
      this.updateVisibleEvents();
    } else {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
      this.eventClick.emit(event);
    }
  }

  trackByFn(index: number, item: TimelineEvent): string {
    return item.id! + index;
  }

  getEventMargin(event: TimelineEvent): string {
    return event.level ? `${event.level * 20}px` : '0';
  }

  isLastInLevel(event: TimelineEvent, index: number): boolean {
    if (event.level === 0) return false;
    
    const siblings = this.visibleEvents.filter(e => 
      e.parentId === event.parentId
    );
    
    return index === this.visibleEvents.findIndex(e => e.id === siblings[siblings.length - 1].id);
  }

  getEventClasses(event: TimelineEvent, index: number): {[key: string]: boolean} {
    return {
      'active': index === this.activeIndex,
      'completed': !!event.completed,
      'level-1': event.level === 1,
      'level-2': event.level === 2,
      'level-3': event.level === 3,
      'last-in-level': this.isLastInLevel(event, index)
    };
  }
}