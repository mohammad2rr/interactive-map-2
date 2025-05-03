import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p class="stat-number">1,234</p>
          <p class="stat-label">Active Users</p>
        </div>
        <div class="stat-card">
          <h3>Total Maps</h3>
          <p class="stat-number">567</p>
          <p class="stat-label">Published Maps</p>
        </div>
        <div class="stat-card">
          <h3>Content</h3>
          <p class="stat-number">89</p>
          <p class="stat-label">Pending Reviews</p>
        </div>
      </div>

      <div class="dashboard-actions">
        <div class="action-card">
          <h2>Content Management</h2>
          <ul>
            <li>Manage Maps</li>
            <li>Review Submissions</li>
            <li>Update Categories</li>
          </ul>
        </div>
        <div class="action-card">
          <h2>User Management</h2>
          <ul>
            <li>View Users</li>
            <li>Manage Permissions</li>
            <li>User Reports</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-dashboard {
        padding: 2rem;
      }
      .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
      }
      .stat-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: #2c3e50;
        margin: 0.5rem 0;
      }
      .stat-label {
        color: #666;
        font-size: 0.9rem;
      }
      .dashboard-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      .action-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .action-card ul {
        list-style: none;
        padding: 0;
        margin-top: 1rem;
      }
      .action-card li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
        cursor: pointer;
      }
      .action-card li:hover {
        background: #f5f5f5;
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
      h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      h3 {
        color: #666;
        margin: 0;
      }
    `,
  ],
})
export class DashboardComponent {}
