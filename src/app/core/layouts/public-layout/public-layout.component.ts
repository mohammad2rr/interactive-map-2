import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div
      class="d-flex flex-column min-vh-100"
      [class.bg-dark]="themeService.isDarkMode()"
      [class.text-light]="themeService.isDarkMode()"
    >
      <header
        class="bg-white shadow-sm fixed-top"
        [class.bg-dark]="themeService.isDarkMode()"
        [class.border-bottom]="!themeService.isDarkMode()"
        [class.border-secondary]="themeService.isDarkMode()"
      >
        <nav
          class="navbar navbar-expand-lg"
          [class.navbar-light]="!themeService.isDarkMode()"
          [class.navbar-dark]="themeService.isDarkMode()"
        >
          <div class="container">
            <a class="navbar-brand fw-bold" routerLink="/">Interactive Map</a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" routerLink="/" routerLinkActive="active"
                    >Main-Page</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/blog"
                    routerLinkActive="active"
                    >Blog</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/map"
                    routerLinkActive="active"
                    >Map</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/about"
                    routerLinkActive="active"
                    >About</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/admin/dashboard"
                    routerLinkActive="active"
                    >Admin</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/user/dashboard"
                    routerLinkActive="active"
                    >User</a
                  >
                </li>
              </ul>
              <div class="d-flex gap-2">
                <button
                  class="btn"
                  [class.btn-outline-secondary]="!themeService.isDarkMode()"
                  [class.btn-outline-light]="themeService.isDarkMode()"
                  (click)="toggleTheme()"
                >
                  <span>{{ themeService.isDarkMode() ? '🌙' : '☀️' }}</span>
                </button>
                <a routerLink="/login" class="btn btn-outline-primary">Login</a>
                <a routerLink="/register" class="btn btn-primary">Register</a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main class="flex-grow-1 mt-5 pt-4">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-dark text-light py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-12 col-md-4">
              <h3 class="h5 mb-3">Interactive Map</h3>
              <p class="text-light-emphasis">
                Your gateway to exploring the world through interactive maps and
                geographical data.
              </p>
            </div>
            <div class="col-12 col-md-4">
              <h3 class="h5 mb-3">Quick Links</h3>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <a routerLink="/map" class="text-light text-decoration-none"
                    >Map</a
                  >
                </li>
                <li class="mb-2">
                  <a routerLink="/about" class="text-light text-decoration-none"
                    >About</a
                  >
                </li>
                <li class="mb-2">
                  <a
                    routerLink="/contact"
                    class="text-light text-decoration-none"
                    >Contact</a
                  >
                </li>
              </ul>
            </div>
            <div class="col-12 col-md-4">
              <h3 class="h5 mb-3">Legal</h3>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <a href="#" class="text-light text-decoration-none"
                    >Privacy Policy</a
                  >
                </li>
                <li class="mb-2">
                  <a href="#" class="text-light text-decoration-none"
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
  `,
  styles: [
    `
      .navbar-nav .nav-link.active {
        color: var(--bs-primary) !important;
        font-weight: 500;
      }
    `,
  ],
})
export class PublicLayoutComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
