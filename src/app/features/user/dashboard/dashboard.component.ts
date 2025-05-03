import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🗺️</div>
          <div class="stat-info">
            <h3>Total Maps</h3>
            <p class="stat-value">24</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <h3>Favorites</h3>
            <p class="stat-value">8</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Shared With</h3>
            <p class="stat-value">12</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>Views</h3>
            <p class="stat-value">156</p>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">📝</div>
              <div class="activity-content">
                <p>Created new map "World Population"</p>
                <span class="activity-time">2 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">🔗</div>
              <div class="activity-content">
                <p>Shared "Climate Change" with John</p>
                <span class="activity-time">5 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">⭐</div>
              <div class="activity-content">
                <p>Added "Economic Growth" to favorites</p>
                <span class="activity-time">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button class="action-btn">
              <i>🗺️</i>
              <span>Create New Map</span>
            </button>
            <button class="action-btn">
              <i>📋</i>
              <span>Use Template</span>
            </button>
            <button class="action-btn">
              <i>🔗</i>
              <span>Share Map</span>
            </button>
            <button class="action-btn">
              <i>📊</i>
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 2rem;
      }

      h1 {
        color: #2c3e50;
        margin-bottom: 2rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .stat-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        background: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-info h3 {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
      }

      .stat-value {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
      }

      .recent-activity,
      .quick-actions {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h2 {
        color: #2c3e50;
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 1.2rem;
      }

      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
      }

      .activity-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .activity-icon {
        font-size: 1.2rem;
        width: 32px;
        height: 32px;
        background: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .activity-content {
        flex: 1;
      }

      .activity-content p {
        margin: 0;
        color: #2c3e50;
      }

      .activity-time {
        font-size: 0.8rem;
        color: #666;
      }

      .action-buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background: #f5f5f5;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .action-btn:hover {
        background: #e0e0e0;
      }

      .action-btn i {
        font-size: 1.5rem;
      }

      .action-btn span {
        font-size: 0.9rem;
        color: #2c3e50;
      }

      @media (max-width: 768px) {
        .dashboard-grid {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent {}
