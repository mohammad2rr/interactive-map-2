import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="public-layout">
      <header>
        <nav>
          <a routerLink="/" routerLinkActive="active">Home</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
          <a routerLink="/blog" routerLinkActive="active">Blog</a>
          <a routerLink="/map" routerLinkActive="active">Map</a>
          <a routerLink="/iran-map" routerLinkActive="active">Iran Map</a>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <footer>
        <!-- Public footer content -->
      </footer>
    </div>
  `,
  styles: [
    `
      .public-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      main {
        flex: 1;
      }
      nav {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: #f5f5f5;
      }
      nav a {
        text-decoration: none;
        color: #333;
        padding: 0.5rem 1rem;
        border-radius: 4px;
      }
      nav a:hover {
        background: #e0e0e0;
      }
      nav a.active {
        background: #007bff;
        color: white;
      }
    `,
  ],
})
export class PublicLayoutComponent {}
