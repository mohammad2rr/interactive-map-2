import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalTimelineComponent } from '../../shared/components/horizontal-timeline/horizontal-timeline.component';

@Component({
  selector: 'app-timeline-host',
  standalone: true,
  imports: [CommonModule,HorizontalTimelineComponent],
  template: `
    <div class="about-container">
      <div class="about-content">
      
        <div class="about-section">
        <app-horizontal-timeline
        [events]="timelineEvents" 
        [activeIndex]="activeIndex"
        [align]="'top'"
        (activeIndexChange)="onActiveIndexChange($event)"
        (eventClick)="onEventClick($event)">
        ></app-horizontal-timeline>
        </div>

        <div class="about-section">
        
        </div>

        <div class="about-section">
       
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .about-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .about-content {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2c3e50;
        margin-bottom: 2rem;
        text-align: center;
      }
      h2 {
        color: #34495e;
        margin: 1.5rem 0 1rem 0;
      }
      .about-section {
        margin-bottom: 2rem;
      }
      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      .features-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      .features-list li {
        padding: 0.5rem 0;
        color: #666;
        display: flex;
        align-items: center;
      }
      .features-list li:before {
        content: '✓';
        color: #2ecc71;
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class TimeLineHostComponent {

    activeIndex = 1;
  
    timelineEvents = [
      {
        title: 'Project Kickoff',
        date: 'January 15, 2023',
        description: 'Initial meeting with stakeholders',
        icon: 'fas fa-flag',
        color: 'purple',
        completed: true
      },
      {
        title: 'Requirements Gathering',
        date: 'February 1, 2023',
        description: 'Collect all business requirements',
        icon: 'fas fa-clipboard-list',
        color: 'purple',
        completed: true
      },
      {
        title: 'Design Phase',
        date: 'March 10, 2023',
        description: 'Create UI/UX designs',
        icon: 'fas fa-palette',
        color: 'purple',
      },
      {
        title: 'Development',
        date: 'April 5, 2023',
        description: 'Start coding the application',
        icon: 'fas fa-code',
        color: 'purple',
      },
      {
        title: 'Testing',
        date: 'May 20, 2023',
        description: 'QA and user testing',
        icon: 'fas fa-bug',
        color: 'purple',
      },
      {
        title: 'Deployment',
        date: 'June 15, 2023',
        description: 'Production rollout',
        icon: 'fas fa-rocket',
        color: 'purple',
      },  {
        title: 'Development',
        date: 'April 5, 2023',
        description: 'Start coding the application',
        icon: 'fas fa-code',
        color: 'purple',
      },
      {
        title: 'Testing',
        date: 'May 20, 2023',
        description: 'QA and user testing',
        icon: 'fas fa-bug',
        color: 'purple',
      },
      {
        title: 'Deployment',
        date: 'June 15, 2023',
        description: 'Production rollout',
        icon: 'fas fa-rocket',
        color: 'purple',
      }
    ];
  
    onActiveIndexChange(index: number): void {
      console.log('Active index changed:', index);
    }
  
    onEventClick(event: any): void {
      console.log('Event clicked:', event);
    }
}
