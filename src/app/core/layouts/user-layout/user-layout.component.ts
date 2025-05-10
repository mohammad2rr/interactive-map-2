import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div
      class="d-flex flex-column min-vh-100 overflow-hidden fade-in"
      [class.bg-dark]="themeService.isDarkMode()"
      [class.text-light]="themeService.isDarkMode()"
    >
      <header class="modern-header sticky-top">
        <nav
          class="navbar navbar-expand-lg"
          [class.navbar-light]="!themeService.isDarkMode()"
          [class.navbar-dark]="themeService.isDarkMode()"
        >
          <div class="container-fluid px-4">
            <a
              class="navbar-brand fw-bold d-flex align-items-center gap-2"
              href="#"
            >
              <span class="fs-4 text-gradient">👤</span>
              <span class="text-gradient">User Dashboard</span>
            </a>
            <div class="d-flex align-items-center gap-3">
              <button
                class="modern-button outline"
                [class.btn-outline-secondary]="!themeService.isDarkMode()"
                [class.btn-outline-light]="themeService.isDarkMode()"
                (click)="toggleTheme()"
              >
                <span class="icon">{{
                  themeService.isDarkMode() ? '🌙' : '☀️'
                }}</span>
              </button>
              <button
                class="modern-button outline"
                type="button"
                (click)="toggleSidebar()"
                [attr.aria-expanded]="isSidebarOpen"
              >
                <span class="icon">☰</span>
              </button>
              <div class="d-none d-md-flex align-items-center gap-2">
                <span class="fw-medium">User</span>
                <img
                  src="assets/images/user-avatar.jpg"
                  alt="User Avatar"
                  class="rounded-circle border"
                  style="width: 40px; height: 40px; object-fit: cover"
                />
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div class="d-flex flex-grow-1 position-relative">
        <aside
          class="modern-sidebar position-fixed h-100 slide-in"
          [class.bg-dark]="themeService.isDarkMode()"
          [class.border-secondary]="themeService.isDarkMode()"
          [style.transform]="
            !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)'
          "
          style="
            width: 250px;
            z-index: 1040;
            top: 0;
            left: 0;
          "
        >
          <nav class="nav flex-column p-3 gap-1">
            <a
              class="modern-nav-link"
              routerLink="/user/dashboard"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
            >
              <span class="icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/user/profile"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
            >
              <span class="icon">👤</span>
              <span>Profile</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/user/maps"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
            >
              <span class="icon">🗺️</span>
              <span>My Maps</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/user/settings"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
            >
              <span class="icon">⚙️</span>
              <span>Settings</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/user/favorites"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
            >
              <span class="icon">⭐</span>
              <span>Favorites</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/user/templates"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
            >
              <span class="icon">⭐</span>
              <span>templates</span>
            </a>
          </nav>
        </aside>

        <main
          class="flex-grow-1 p-4 fade-in"
          [style.margin-left]="!isMobile && isSidebarOpen ? '250px' : '0'"
          style="transition: margin-left 0.3s ease"
        >
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div
      class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 fade-in"
      *ngIf="isSidebarOpen && isMobile"
      (click)="toggleSidebar()"
      style="
        z-index: 1030;
        display: block;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      "
    ></div>
  `,
  styles: [],
})
export class UserLayoutComponent {
  isSidebarOpen = false;
  isMobile = false;

  constructor(public themeService: ThemeService) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 992;
    if (!this.isMobile) {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
