import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <a routerLink="/">Interactive Map</a>
        </div>
        <nav class="main-nav">
          <a routerLink="/map" routerLinkActive="active">Map</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>
        <div class="auth-buttons">
          <a routerLink="/login" class="btn btn-outline">Login</a>
          <a routerLink="/register" class="btn btn-primary">Register</a>
        </div>
      </div>
    </header>

    <main class="main-content">
      <section class="hero">
        <div class="hero-content">
          <h1>Explore the World with Interactive Maps</h1>
          <p>
            Discover countries, provinces, and geographical data in an engaging
            way
          </p>
          <a routerLink="/map" class="btn btn-primary btn-large"
            >Start Exploring</a
          >
        </div>
      </section>

      <section class="features">
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🗺️</div>
            <h3>Interactive Maps</h3>
            <p>Explore detailed maps with zoom and pan capabilities</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌍</div>
            <h3>Country Data</h3>
            <p>Access comprehensive information about countries</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Statistics</h3>
            <p>View and analyze geographical data and statistics</p>
          </div>
        </div>
      </section>

      <section class="cta">
        <h2>Ready to Start Your Journey?</h2>
        <p>Create an account to access advanced features and save your maps</p>
        <a routerLink="/register" class="btn btn-primary btn-large"
          >Get Started</a
        >
      </section>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Interactive Map</h3>
          <p>
            Your gateway to exploring the world through interactive maps and
            geographical data.
          </p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/map">Map</a></li>
            <li><a routerLink="/about">About</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Interactive Map. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [
    `
      .header {
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo a {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
        text-decoration: none;
      }
      .main-nav {
        display: flex;
        gap: 2rem;
      }
      .main-nav a {
        color: #666;
        text-decoration: none;
        transition: color 0.2s;
      }
      .main-nav a:hover,
      .main-nav a.active {
        color: #3498db;
      }
      .auth-buttons {
        display: flex;
        gap: 1rem;
      }
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s;
      }
      .btn-primary {
        background: #3498db;
        color: white;
        border: none;
      }
      .btn-primary:hover {
        background: #2980b9;
      }
      .btn-outline {
        background: transparent;
        color: #3498db;
        border: 1px solid #3498db;
      }
      .btn-outline:hover {
        background: #f5f5f5;
      }
      .btn-large {
        padding: 0.75rem 1.5rem;
        font-size: 1.1rem;
      }

      .main-content {
        margin-top: 80px;
      }
      .hero {
        background: linear-gradient(135deg, #3498db, #2c3e50);
        color: white;
        padding: 4rem 2rem;
        text-align: center;
      }
      .hero-content {
        max-width: 800px;
        margin: 0 auto;
      }
      .hero h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      .hero p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .features {
        padding: 4rem 2rem;
        background: #f5f5f5;
      }
      .features h2 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 3rem;
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .feature-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      .feature-card h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      .feature-card p {
        color: #666;
      }

      .cta {
        padding: 4rem 2rem;
        text-align: center;
        background: white;
      }
      .cta h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      .cta p {
        color: #666;
        margin-bottom: 2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .footer {
        background: #2c3e50;
        color: white;
        padding: 4rem 2rem 2rem;
      }
      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }
      .footer-section h3 {
        margin-bottom: 1rem;
        color: #ecf0f1;
      }
      .footer-section p {
        color: #bdc3c7;
        line-height: 1.6;
      }
      .footer-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .footer-section ul li {
        margin-bottom: 0.5rem;
      }
      .footer-section ul li a {
        color: #bdc3c7;
        text-decoration: none;
        transition: color 0.2s;
      }
      .footer-section ul li a:hover {
        color: white;
      }
      .footer-bottom {
        max-width: 1200px;
        margin: 2rem auto 0;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        color: #bdc3c7;
      }
    `,
  ],
})
export class LandingComponent {}
