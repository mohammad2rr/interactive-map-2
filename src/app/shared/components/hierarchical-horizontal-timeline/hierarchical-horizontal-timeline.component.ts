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
  }
  get events(): TimelineEvent[] {
    return this._events;
  }
  
  @Input() activeIndex: number = 0;
  @Input() align: 'top' | 'bottom' = 'top';
  @Input() responsive: boolean = true;
  @Input() showConnector: boolean = true;
  @Input() connectorColor: string = '#dee2e6';
  @Input() childEventsGap: string = '2rem';
  @Input() verticalConnectorHeight: string = '1rem';

  @Output() eventClick = new EventEmitter<TimelineEvent>();
  @Output() activeIndexChange = new EventEmitter<number>();

  private _events: TimelineEvent[] = [];

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

  toggleEventExpansion(event: TimelineEvent): void {
    if (event.children && event.children.length > 0) {
      event.expanded = !event.expanded;
    }
  }

  onEventClick(event: TimelineEvent, index: number): void {
    if (event.children && event.children.length > 0) {
      this.toggleEventExpansion(event);
    } else {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
      this.eventClick.emit(event);
    }
  }

  trackByFn(index: number, item: TimelineEvent): string {
    return item.id! + index;
  }

  getEventClasses(event: TimelineEvent, index: number): {[key: string]: boolean} {
    return {
      'active': index === this.activeIndex,
      'completed': !!event.completed,
      [`level-${event.level}`]: true,
      'has-children': !!(event.children && event.children.length > 0)
    };
  }

  getChildEventsContainerStyle(event: TimelineEvent): any {
    return {
      'margin-top': this.verticalConnectorHeight,
      'padding-left': event.level && event.level > 0 ? '1rem' : '0'
    };
  }

  getVerticalConnectorStyle(): any {
    return {
      'height': this.verticalConnectorHeight,
      'background-color': this.connectorColor
    };
  }

  getHorizontalConnectorStyle(): any {
    return {
      'background-color': this.connectorColor
    };
  }
}