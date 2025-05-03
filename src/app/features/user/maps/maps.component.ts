import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-maps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="maps-container">
      <h1>My Maps</h1>
      <div class="maps-grid">
        <div class="map-card" *ngFor="let i of [1, 2, 3, 4, 5, 6]">
          <div class="map-preview"></div>
          <div class="map-info">
            <h3>Map {{ i }}</h3>
            <p>Last modified: {{ today | date }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .maps-container {
        padding: 2rem;
      }
      .maps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      .map-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }
      .map-card:hover {
        transform: translateY(-2px);
      }
      .map-preview {
        height: 200px;
        background: #f5f5f5;
      }
      .map-info {
        padding: 1rem;
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
      h3 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
      }
      p {
        color: #666;
        margin: 0;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class MapsComponent {
  today = new Date();
}
