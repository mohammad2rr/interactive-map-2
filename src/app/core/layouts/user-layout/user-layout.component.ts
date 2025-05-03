import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>User Panel</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/user/dashboard" routerLinkActive="active">
            <i class="icon">📊</i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/user/maps" routerLinkActive="active">
            <i class="icon">🗺️</i>
            <span>My Maps</span>
          </a>
          <a routerLink="/user/activity" routerLinkActive="active">
            <i class="icon">📝</i>
            <span>Activity</span>
          </a>
          <a routerLink="/user/settings" routerLinkActive="active">
            <i class="icon">⚙️</i>
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .layout-container {
        display: flex;
        min-height: 100vh;
      }

      .sidebar {
        width: 250px;
        background: #2c3e50;
        color: white;
        padding: 1rem;
        position: fixed;
        height: 100vh;
        overflow-y: auto;
      }

      .sidebar-header {
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 1rem;
      }

      .sidebar-header h2 {
        margin: 0;
        font-size: 1.2rem;
        color: #ecf0f1;
      }

      .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .sidebar-nav a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: #bdc3c7;
        text-decoration: none;
        border-radius: 4px;
        transition: all 0.2s;
      }

      .sidebar-nav a:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .sidebar-nav a.active {
        background: #3498db;
        color: white;
      }

      .sidebar-nav .icon {
        font-size: 1.2rem;
      }

      .main-content {
        flex: 1;
        margin-left: 250px;
        padding: 2rem;
        background: #f5f5f5;
      }

      @media (max-width: 768px) {
        .sidebar {
          width: 200px;
        }

        .main-content {
          margin-left: 200px;
        }
      }

      @media (max-width: 576px) {
        .sidebar {
          width: 100%;
          height: auto;
          position: relative;
        }

        .main-content {
          margin-left: 0;
        }

        .layout-container {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class UserLayoutComponent {}
