import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div
      class="d-flex flex-column min-vh-100 overflow-hidden fade-in"
      [class.bg-dark]="themeService.isDarkMode()"
      [class.text-light]="themeService.isDarkMode()"
    >
      <header
        class="bg-white shadow-sm sticky-top"
        [class.bg-dark]="themeService.isDarkMode()"
        [class.border-bottom]="!themeService.isDarkMode()"
        [class.border-secondary]="themeService.isDarkMode()"
      >
        <nav
          class="navbar navbar-expand-lg"
          [class.navbar-light]="!themeService.isDarkMode()"
          [class.navbar-dark]="themeService.isDarkMode()"
        >
          <div class="container px-4">
            <a
              class="navbar-brand fw-bold d-flex align-items-center gap-2"
              routerLink="/"
            >
              <span class="fs-4 text-gradient">🗺️</span>
              <span class="text-gradient">Interactive Map</span>
            </a>
            <!-- Desktop Navigation -->
            <div class="d-none d-lg-flex align-items-center gap-3">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a
                    class="nav-link px-3 py-2 rounded-3"
                    routerLink="/"
                    routerLinkActive="active"
                    >Main-Page</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link px-3 py-2 rounded-3"
                    routerLink="/blog"
                    routerLinkActive="active"
                    >Blog</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link px-3 py-2 rounded-3"
                    routerLink="/map"
                    routerLinkActive="active"
                    >Map</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link px-3 py-2 rounded-3"
                    routerLink="/about"
                    routerLinkActive="active"
                    >About</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link px-3 py-2 rounded-3"
                    routerLink="/admin/dashboard"
                    routerLinkActive="active"
                    >Admin</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link px-3 py-2 rounded-3"
                    routerLink="/user/dashboard"
                    routerLinkActive="active"
                    >User</a
                  >
                </li>
              </ul>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-icon"
                  [class.btn-outline-secondary]="!themeService.isDarkMode()"
                  [class.btn-outline-light]="themeService.isDarkMode()"
                  (click)="toggleTheme()"
                >
                  <span class="fs-5">{{
                    themeService.isDarkMode() ? '🌙' : '☀️'
                  }}</span>
                </button>
                <a routerLink="/login" class="btn btn-outline-primary px-4"
                  >Login</a
                >
                <a routerLink="/register" class="btn btn-primary px-4"
                  >Register</a
                >
              </div>
            </div>
            <!-- Mobile Navigation Toggle -->
            <div class="d-flex d-lg-none align-items-center gap-2">
              <button
                class="btn btn-icon"
                [class.btn-outline-secondary]="!themeService.isDarkMode()"
                [class.btn-outline-light]="themeService.isDarkMode()"
                (click)="toggleTheme()"
              >
                <span class="fs-5">{{
                  themeService.isDarkMode() ? '🌙' : '☀️'
                }}</span>
              </button>
              <button
                class="btn btn-icon"
                [class.btn-outline-secondary]="!themeService.isDarkMode()"
                [class.btn-outline-light]="themeService.isDarkMode()"
                type="button"
                (click)="toggleSidebar()"
                [attr.aria-expanded]="isSidebarOpen"
              >
                <span class="fs-5">☰</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div class="d-flex flex-grow-1 position-relative">
        <!-- Mobile Sidebar -->
        <aside
          class="modern-sidebar position-fixed h-100 d-lg-none"
          [class.bg-dark]="themeService.isDarkMode()"
          [class.border-secondary]="themeService.isDarkMode()"
          [style.transform]="
            !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)'
          "
          style="
            width: 250px;
            transition: transform 0.3s ease;
            z-index: 1040;
            top: 0;
            left: 0;
          "
        >
          <nav class="nav flex-column p-3 gap-1">
            <a
              class="modern-nav-link"
              routerLink="/"
              routerLinkActive="active"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
              (click)="closeSidebar()"
            >
              <span class="icon">🏠</span>
              <span>Main Page</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/blog"
              routerLinkActive="active"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
              (click)="closeSidebar()"
            >
              <span class="icon">📚</span>
              <span>Blog</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/map"
              routerLinkActive="active"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
              (click)="closeSidebar()"
            >
              <span class="icon">🗺️</span>
              <span>Map</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/about"
              routerLinkActive="active"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
              (click)="closeSidebar()"
            >
              <span class="icon">ℹ️</span>
              <span>About</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/admin/dashboard"
              routerLinkActive="active"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
              (click)="closeSidebar()"
            >
              <span class="icon">👑</span>
              <span>Admin</span>
            </a>
            <a
              class="modern-nav-link"
              routerLink="/user/dashboard"
              routerLinkActive="active"
              [class.text-light]="themeService.isDarkMode()"
              [class.text-dark]="!themeService.isDarkMode()"
              (click)="closeSidebar()"
            >
              <span class="icon">👤</span>
              <span>User</span>
            </a>
            <div class="mt-auto pt-3 border-top">
              <a
                class="modern-nav-link"
                routerLink="/login"
                [class.text-light]="themeService.isDarkMode()"
                [class.text-dark]="!themeService.isDarkMode()"
                (click)="closeSidebar()"
              >
                <span class="icon">🔑</span>
                <span>Login</span>
              </a>
              <a
                class="modern-nav-link"
                routerLink="/register"
                [class.text-light]="themeService.isDarkMode()"
                [class.text-dark]="!themeService.isDarkMode()"
                (click)="closeSidebar()"
              >
                <span class="icon">✍️</span>
                <span>Register</span>
              </a>
            </div>
          </nav>
        </aside>

        <main class="flex-grow-1 p-4 fade-in">
          <router-outlet></router-outlet>
        </main>
      </div>

      <footer class="bg-dark text-light py-5">
        <div class="container px-4">
          <div class="row g-4">
            <div class="col-12 col-md-4">
              <h3 class="h5 mb-3 d-flex align-items-center gap-2">
                <span class="fs-4">🗺️</span>
                <span>Interactive Map</span>
              </h3>
              <p class="text-light-emphasis">
                Your gateway to exploring the world through interactive maps and
                geographical data.
              </p>
            </div>
            <div class="col-12 col-md-4">
              <h3 class="h5 mb-3">Quick Links</h3>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <a
                    routerLink="/map"
                    class="text-light text-decoration-none d-inline-block py-1"
                    >Map</a
                  >
                </li>
                <li class="mb-2">
                  <a
                    routerLink="/about"
                    class="text-light text-decoration-none d-inline-block py-1"
                    >About</a
                  >
                </li>
                <li class="mb-2">
                  <a
                    routerLink="/contact"
                    class="text-light text-decoration-none d-inline-block py-1"
                    >Contact</a
                  >
                </li>
              </ul>
            </div>
            <div class="col-12 col-md-4">
              <h3 class="h5 mb-3">Legal</h3>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <a
                    href="#"
                    class="text-light text-decoration-none d-inline-block py-1"
                    >Privacy Policy</a
                  >
                </li>
                <li class="mb-2">
                  <a
                    href="#"
                    class="text-light text-decoration-none d-inline-block py-1"
                    >Terms of Service</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <hr class="my-4" />
          <div class="text-center">
            <p class="mb-0">
              &copy; 2024 Interactive Map. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
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
  styles: [
    `
      .navbar-nav .nav-link.active {
        color: var(--bs-primary) !important;
        font-weight: 500;
        background-color: var(--bs-primary-bg-subtle);
      }
      .btn-icon {
        width: 40px;
        height: 40px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .modern-button {
        background: none;
        border: 1px solid;
        padding: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .modern-button:hover {
        opacity: 0.8;
      }
      .modern-button .icon {
        font-size: 1.2rem;
      }
      .modern-nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        margin: 0.25rem 0;
      }
      .modern-nav-link::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background: var(--bs-primary);
        transform: scaleY(0);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 0 4px 4px 0;
      }
      .modern-nav-link:hover {
        background-color: var(--bs-primary-bg-subtle);
        transform: translateX(4px);
      }
      .modern-nav-link:hover::before {
        transform: scaleY(1);
      }
      .modern-nav-link.active {
        background-color: var(--bs-primary);
        color: white !important;
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.2);
      }
      .modern-nav-link.active::before {
        transform: scaleY(1);
        background: white;
      }
      .modern-nav-link .icon {
        font-size: 1.2rem;
        transition: transform 0.3s ease;
      }
      .modern-nav-link:hover .icon {
        transform: scale(1.1);
      }
      .modern-nav-link.active .icon {
        transform: scale(1.1);
      }
      .text-gradient {
        background: linear-gradient(45deg, var(--bs-primary), var(--bs-info));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .modern-sidebar {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
      }
      .bg-dark .modern-sidebar {
        background: rgba(33, 37, 41, 0.95);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
      }
      .fade-in {
        animation: fadeIn 0.3s ease-in-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .slide-in {
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      @keyframes slideIn {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class PublicLayoutComponent {
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
    this.isMobile = window.innerWidth < 992; // Changed to match Bootstrap's lg breakpoint
    if (!this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
