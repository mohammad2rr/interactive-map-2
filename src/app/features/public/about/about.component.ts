import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <div class="about-content">
        <h1>About Interactive Map</h1>
        <div class="about-section">
          <h2>Our Mission</h2>
          <p>
            Interactive Map is dedicated to providing an intuitive and powerful
            mapping solution that helps users explore and understand
            geographical data in an engaging way.
          </p>
        </div>

        <div class="about-section">
          <h2>Features</h2>
          <ul class="features-list">
            <li>Interactive country and province maps</li>
            <li>Detailed geographical information</li>
            <li>User-friendly interface</li>
            <li>Customizable map views</li>
            <li>Real-time data updates</li>
          </ul>
        </div>

        <div class="about-section">
          <h2>Technology</h2>
          <p>
            Built with modern web technologies including Angular, TypeScript,
            and advanced mapping libraries, our platform ensures a smooth and
            responsive user experience.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .about-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .about-content {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2c3e50;
        margin-bottom: 2rem;
        text-align: center;
      }
      h2 {
        color: #34495e;
        margin: 1.5rem 0 1rem 0;
      }
      .about-section {
        margin-bottom: 2rem;
      }
      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      .features-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      .features-list li {
        padding: 0.5rem 0;
        color: #666;
        display: flex;
        align-items: center;
      }
      .features-list li:before {
        content: '✓';
        color: #2ecc71;
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class AboutComponent {}
