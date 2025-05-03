import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="admin-layout">
      <header>
        <nav class="header-nav">
          <div class="logo">Admin Panel</div>
          <div class="admin-controls">
            <span class="admin-name">Admin User</span>
            <img
              src="assets/images/admin-avatar.png"
              alt="Admin Avatar"
              class="avatar"
            />
          </div>
        </nav>
      </header>
      <div class="layout-content">
        <aside class="admin-sidebar">
          <nav class="sidebar-nav">
            <a routerLink="/admin/dashboard" routerLinkActive="active">
              <i class="icon">📊</i> Dashboard
            </a>
            <a routerLink="/admin/content" routerLinkActive="active">
              <i class="icon">📝</i> Content Management
            </a>
            <a routerLink="/admin/users" routerLinkActive="active">
              <i class="icon">👥</i> User Management
            </a>
            <a routerLink="/admin/maps" routerLinkActive="active">
              <i class="icon">🗺️</i> Map Management
            </a>
            <a routerLink="/admin/settings" routerLinkActive="active">
              <i class="icon">⚙️</i> Settings
            </a>
          </nav>
        </aside>
        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .header-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: #2c3e50;
        color: white;
      }
      .logo {
        font-size: 1.5rem;
        font-weight: bold;
      }
      .admin-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .admin-name {
        color: #ecf0f1;
      }
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .layout-content {
        display: flex;
        flex: 1;
      }
      .admin-sidebar {
        width: 280px;
        background: #34495e;
        padding: 1rem;
      }
      .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .sidebar-nav a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        color: #ecf0f1;
        text-decoration: none;
        border-radius: 4px;
        transition: all 0.2s;
      }
      .sidebar-nav a:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .sidebar-nav a.active {
        background: #3498db;
        color: white;
      }
      .icon {
        font-size: 1.2rem;
      }
      main {
        flex: 1;
        padding: 2rem;
        background: #f5f5f5;
      }
    `,
  ],
})
export class AdminLayoutComponent {}
