import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-activity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="activity-container">
      <h1>Recent Activity</h1>
      <div class="activity-timeline">
        <div class="activity-item" *ngFor="let i of [1, 2, 3, 4, 5]">
          <div class="activity-icon">📝</div>
          <div class="activity-content">
            <h3>Activity {{ i }}</h3>
            <p>Description of the activity that was performed</p>
            <span class="activity-time">{{ today | date : 'medium' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .activity-container {
        padding: 2rem;
      }
      .activity-timeline {
        margin-top: 2rem;
      }
      .activity-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .activity-icon {
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 50%;
      }
      .activity-content {
        flex: 1;
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
      h3 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
      }
      p {
        color: #666;
        margin: 0 0 0.5rem 0;
      }
      .activity-time {
        color: #999;
        font-size: 0.8rem;
      }
    `,
  ],
})
export class ActivityComponent {
  today = new Date();
}
