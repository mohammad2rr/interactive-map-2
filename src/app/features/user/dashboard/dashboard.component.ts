import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-dashboard">
      <h1>User Dashboard</h1>
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h2>My Maps</h2>
          <p>View and manage your saved maps</p>
        </div>
        <div class="dashboard-card">
          <h2>Recent Activity</h2>
          <p>Track your recent interactions</p>
        </div>
        <div class="dashboard-card">
          <h2>Settings</h2>
          <p>Manage your account preferences</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .user-dashboard {
        padding: 2rem;
      }
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      .dashboard-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }
      .dashboard-card:hover {
        transform: translateY(-2px);
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
      h2 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }
      p {
        color: #666;
      }
    `,
  ],
})
export class DashboardComponent {}
