import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    FormsModule,
  ],
  template: `
    <div class="layout-container">
      <aside class="sidebar" [class.collapsed]="isCollapsed">
        <div class="sidebar-header">
          <div class="profile-section">
            <div class="profile-image" (click)="toggleProfileMenu()">
              <img
                [src]="user.avatar || 'assets/images/default-avatar.png'"
                alt="User Profile"
              />
              <div class="online-status" [class.active]="user.isOnline"></div>
            </div>
            <div class="profile-info" *ngIf="!isCollapsed">
              <h3>{{ user.name }}</h3>
              <p>{{ user.email }}</p>
            </div>
            <div class="profile-menu" *ngIf="showProfileMenu">
              <a routerLink="/user/profile">View Profile</a>
              <a routerLink="/user/settings">Settings</a>
              <a (click)="logout()">Logout</a>
            </div>
          </div>
          <button class="collapse-btn" (click)="toggleSidebar()">
            {{ isCollapsed ? '→' : '←' }}
          </button>
        </div>

        <div class="search-bar" *ngIf="!isCollapsed">
          <input
            type="text"
            placeholder="Search..."
            [(ngModel)]="searchQuery"
          />
          <i class="search-icon">🔍</i>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <h4 *ngIf="!isCollapsed">Main</h4>
            <a routerLink="/user/dashboard" routerLinkActive="active">
              <i class="icon">📊</i>
              <span *ngIf="!isCollapsed">Dashboard</span>
              <span class="notification-badge" *ngIf="notifications.dashboard"
                >3</span
              >
            </a>
            <a routerLink="/user/maps" routerLinkActive="active">
              <i class="icon">🗺️</i>
              <span *ngIf="!isCollapsed">My Maps</span>
              <span class="notification-badge" *ngIf="notifications.maps"
                >5</span
              >
            </a>
            <a routerLink="/user/activity" routerLinkActive="active">
              <i class="icon">📝</i>
              <span *ngIf="!isCollapsed">Activity</span>
              <span class="notification-badge" *ngIf="notifications.activity"
                >2</span
              >
            </a>
          </div>

          <div class="nav-section">
            <h4 *ngIf="!isCollapsed">Content</h4>
            <a routerLink="/user/favorites" routerLinkActive="active">
              <i class="icon">⭐</i>
              <span *ngIf="!isCollapsed">Favorites</span>
            </a>
            <a routerLink="/user/shared" routerLinkActive="active">
              <i class="icon">🔗</i>
              <span *ngIf="!isCollapsed">Shared Maps</span>
              <span class="notification-badge" *ngIf="notifications.shared"
                >1</span
              >
            </a>
            <a routerLink="/user/templates" routerLinkActive="active">
              <i class="icon">📋</i>
              <span *ngIf="!isCollapsed">Templates</span>
            </a>
          </div>

          <div class="nav-section">
            <h4 *ngIf="!isCollapsed">Account</h4>
            <a routerLink="/user/settings" routerLinkActive="active">
              <i class="icon">⚙️</i>
              <span *ngIf="!isCollapsed">Settings</span>
            </a>
            <a routerLink="/user/profile" routerLinkActive="active">
              <i class="icon">👤</i>
              <span *ngIf="!isCollapsed">Profile</span>
            </a>
            <a routerLink="/user/billing" routerLinkActive="active">
              <i class="icon">💳</i>
              <span *ngIf="!isCollapsed">Billing</span>
            </a>
            <a (click)="logout()" class="logout-btn">
              <i class="icon">🚪</i>
              <span *ngIf="!isCollapsed">Logout</span>
            </a>
          </div>
        </nav>
      </aside>

      <main class="main-content" [class.expanded]="isCollapsed">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .layout-container {
        display: flex;
        min-height: 100vh;
        background: #f8f9fa;
      }

      .sidebar {
        width: 280px;
        background: linear-gradient(180deg, #1a1f2e 0%, #2c3e50 100%);
        color: white;
        padding: 1rem;
        position: fixed;
        height: 100vh;
        overflow-y: auto;
        transition: all 0.3s ease;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }

      .sidebar.collapsed {
        width: 80px;
      }

      .sidebar-header {
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 1rem;
        position: relative;
      }

      .profile-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        position: relative;
      }

      .profile-image {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #3498db;
        position: relative;
        cursor: pointer;
      }

      .profile-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .online-status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #95a5a6;
        border: 2px solid #2c3e50;
      }

      .online-status.active {
        background: #2ecc71;
      }

      .profile-info h3 {
        margin: 0;
        font-size: 1rem;
        color: #ecf0f1;
      }

      .profile-info p {
        margin: 0;
        font-size: 0.8rem;
        color: #bdc3c7;
      }

      .profile-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        min-width: 200px;
        z-index: 1000;
      }

      .profile-menu a {
        display: block;
        padding: 0.75rem 1rem;
        color: #2c3e50;
        text-decoration: none;
        transition: background 0.2s;
      }

      .profile-menu a:hover {
        background: #f5f5f5;
      }

      .search-bar {
        position: relative;
        margin-bottom: 1rem;
      }

      .search-bar input {
        width: 100%;
        padding: 0.75rem 2rem 0.75rem 1rem;
        border: none;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .search-bar input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .search-icon {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.5);
      }

      .notification-badge {
        background: #e74c3c;
        color: white;
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: 10px;
        margin-left: auto;
      }

      .collapse-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .collapse-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .nav-section {
        margin-bottom: 1.5rem;
      }

      .nav-section h4 {
        color: #95a5a6;
        font-size: 0.8rem;
        text-transform: uppercase;
        margin: 0 0 0.5rem 0;
        padding: 0 1rem;
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
        border-radius: 8px;
        transition: all 0.2s;
        cursor: pointer;
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
        min-width: 24px;
        text-align: center;
      }

      .logout-btn {
        color: #e74c3c !important;
      }

      .logout-btn:hover {
        background: rgba(231, 76, 60, 0.1) !important;
      }

      .main-content {
        flex: 1;
        margin-left: 280px;
        padding: 2rem;
        transition: all 0.3s ease;
      }

      .main-content.expanded {
        margin-left: 80px;
      }

      @media (max-width: 768px) {
        .sidebar {
          width: 80px;
        }

        .sidebar:not(.collapsed) {
          width: 280px;
        }

        .main-content {
          margin-left: 80px;
        }

        .main-content.expanded {
          margin-left: 0;
        }
      }

      @media (max-width: 576px) {
        .sidebar {
          width: 100%;
          height: auto;
          position: fixed;
          bottom: 0;
          top: auto;
          padding: 0.5rem;
        }

        .sidebar:not(.collapsed) {
          height: 100vh;
          top: 0;
        }

        .sidebar-nav {
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nav-section {
          margin-bottom: 0;
        }

        .nav-section h4 {
          display: none;
        }

        .sidebar-nav a {
          padding: 0.5rem;
        }

        .profile-section {
          display: none;
        }

        .main-content {
          margin-left: 0;
          margin-bottom: 60px;
        }
      }
    `,
  ],
})
export class UserLayoutComponent {
  isCollapsed = false;
  showProfileMenu = false;
  searchQuery = '';

  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'assets/images/default-avatar.png',
    isOnline: true,
  };

  notifications = {
    dashboard: 3,
    maps: 5,
    activity: 2,
    shared: 1,
  };

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    // Implement logout logic here
    console.log('Logout clicked');
  }
}
