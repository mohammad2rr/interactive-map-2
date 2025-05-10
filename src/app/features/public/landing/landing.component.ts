import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
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
  `,
  styles: [
    `
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
        background: var(--primary-gradient);
        color: white;
        padding: 6rem 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/assets/images/map-pattern.svg') center/cover;
          opacity: 0.1;
          animation: float 20s linear infinite;
        }
      }

      .hero-content {
        max-width: 800px;
        margin: 0 auto;
        position: relative;
        z-index: 1;

        h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0.8));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        p {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          line-height: 1.7;
        }
      }

      .features {
        padding: 6rem 2rem;
        background: var(--surface-gradient);
        position: relative;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(to right, 
            transparent 0%, 
            var(--border-color) 50%,
            transparent 100%
          );
        }
      }

      .features h2 {
        text-align: center;
        color: var(--text-primary);
        margin-bottom: 4rem;
        font-size: 2.5rem;
        font-weight: 700;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .feature-card {
        background: var(--surface-gradient);
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border-color);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--primary-gradient);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        &:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-hover);

          &::before {
            transform: scaleX(1);
          }

          .feature-icon {
            transform: scale(1.1) rotate(5deg);
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
      }

      .feature-card h3 {
        color: var(--text-primary);
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .feature-card p {
        color: var(--text-secondary);
        line-height: 1.6;
      }

      .cta {
        padding: 6rem 2rem;
        text-align: center;
        background: var(--surface-gradient);
        position: relative;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/assets/images/cta-pattern.svg') center/cover;
          opacity: 0.05;
          animation: float 15s linear infinite;
        }
      }

      .cta h2 {
        color: var(--text-primary);
        margin-bottom: 1.5rem;
        font-size: 2.5rem;
        font-weight: 700;
      }

      .cta p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
        font-size: 1.2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      @keyframes float {
        from {
          transform: translateY(0) translateX(0);
        }
        to {
          transform: translateY(-10px) translateX(10px);
        }
      }

      @media (max-width: 768px) {
        .hero {
          padding: 4rem 1rem;
        }

        .hero-content h1 {
          font-size: 2.5rem;
        }

        .features {
          padding: 4rem 1rem;
        }

        .cta {
          padding: 4rem 1rem;
        }
      }
    `,
  ],
})
export class LandingComponent {}
