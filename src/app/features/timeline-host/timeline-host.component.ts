import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalTimelineComponent } from '../../shared/components/horizontal-timeline/horizontal-timeline.component';
import { HierarchicalHorizontalTimelineComponent, TimelineEvent } from '../../shared/components/hierarchical-horizontal-timeline/hierarchical-horizontal-timeline.component';

@Component({
  selector: 'app-timeline-host',
  standalone: true,
  imports: [CommonModule,HorizontalTimelineComponent,HierarchicalHorizontalTimelineComponent],
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
         <h1>Project Timeline</h1>
           <app-hierarchical-horizontal-timeline 
              [events]="projectTimeline" 
              [activeIndex]="activeIndex"
              (eventClick)="onTimelineEventClick($event)"
              
              [connectorColor]="'#6c757d'">
           </app-hierarchical-horizontal-timeline>
    
          <div class="event-details" *ngIf="selectedEvent">
          <h2>{{selectedEvent.title}}</h2>
          <p *ngIf="selectedEvent.date"><strong>Date:</strong> {{selectedEvent.date}}</p>
          <p *ngIf="selectedEvent.description">{{selectedEvent.description}}</p>
       </div>
      </div>
      </div>
    </div>
  `,
  styles: [
    `
      .about-container {
        padding: 2rem;
        max-width: 1600px;
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
      .event-details {
      margin-top: 2rem;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 4px;
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


   // activeIndex = 0;
  selectedEvent: TimelineEvent | null = null;

  projectTimeline: TimelineEvent[] = [
    {
      title: 'Project Initiation',
      icon: 'fas fa-flag',
      color: '#4CAF50',
      date: 'Jan 2023',
      description: 'Project kickoff and initial planning',
      children: [
        {
          title: 'Requirements Gathering',
          icon: 'fas fa-clipboard-list',
          color: '#4CAF50',
          date: 'Jan 5-15, 2023',
          children: [
            { title: 'Client Interviews', date: 'Jan 5-8' },
            { title: 'Document Review', date: 'Jan 9-12' }
          ]
        },
        {
          title: 'Team Formation',
          icon: 'fas fa-users',
          color: '#2196F3',
          date: 'Jan 16-20, 2023'
        }
      ]
    },
    {
      title: 'Development Phase',
      icon: 'fas fa-code',
      color: '#2196F3',
      date: 'Feb-Mar 2023',
      children: [
        {
          title: 'Frontend Development',
          icon: 'fas fa-desktop',
          color: '#2196F3',
          date: 'Feb 1-28, 2023',
          children: [
            { title: 'UI Components', completed: true },
            { title: 'State Management' }
          ]
        },
        {
          title: 'Backend Development',
          icon: 'fas fa-server',
          color: '#673AB7',
          date: 'Mar 1-31, 2023'
        }
      ]
    },
    {
      title: 'Testing',
      icon: 'fas fa-bug',
      color: '#FF9800',
      date: 'Apr 2023',
      children: [
        { title: 'Unit Testing' },
        { title: 'Integration Testing' }
      ]
    },
    {
      title: 'Deployment',
      icon: 'fas fa-rocket',
      color: '#E91E63',
      date: 'May 2023'
    },
    {
      title: 'Project Initiation',
      icon: 'fas fa-flag',
      color: '#4CAF50',
      date: 'Jan 2023',
      description: 'Project kickoff and initial planning',
      children: [
        {
          title: 'Requirements Gathering',
          icon: 'fas fa-clipboard-list',
          color: '#4CAF50',
          date: 'Jan 5-15, 2023',
          children: [
            { title: 'Client Interviews', date: 'Jan 5-8' },
            { title: 'Document Review', date: 'Jan 9-12' }
          ]
        },
        {
          title: 'Team Formation',
          icon: 'fas fa-users',
          color: '#2196F3',
          date: 'Jan 16-20, 2023'
        }
      ]
    },
    {
      title: 'Development Phase',
      icon: 'fas fa-code',
      color: '#2196F3',
      date: 'Feb-Mar 2023',
      children: [
        {
          title: 'Frontend Development',
          icon: 'fas fa-desktop',
          color: '#2196F3',
          date: 'Feb 1-28, 2023',
          children: [
            { title: 'UI Components', completed: true },
            { title: 'State Management' }
          ]
        },
        {
          title: 'Backend Development',
          icon: 'fas fa-server',
          color: '#673AB7',
          date: 'Mar 1-31, 2023'
        }
      ]
    },
    {
      title: 'Testing',
      icon: 'fas fa-bug',
      color: '#FF9800',
      date: 'Apr 2023',
      children: [
        { title: 'Unit Testing' },
        { title: 'Integration Testing' }
      ]
    },
    {
      title: 'Deployment',
      icon: 'fas fa-rocket',
      color: '#E91E63',
      date: 'May 2023'
    }
  ];

  onTimelineEventClick(event: TimelineEvent): void {
    this.selectedEvent = event;
    // You could also add additional logic here like:
    // - Navigating to a specific route
    // - Loading detailed content
    // - Triggering animations
  }
}
