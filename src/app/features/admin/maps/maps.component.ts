import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-maps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="maps-container">
      <h1>Map Management</h1>
      <div class="maps-actions">
        <button class="action-button">Create New Map</button>
        <button class="action-button">Import Maps</button>
        <button class="action-button">Export Maps</button>
      </div>

      <div class="maps-grid">
        <div class="map-card" *ngFor="let i of [1, 2, 3, 4, 5, 6]">
          <div class="map-preview"></div>
          <div class="map-info">
            <h3>Map {{ i }}</h3>
            <p>Created: {{ today | date }}</p>
            <div class="map-status">
              <span class="status-badge" [class.published]="i % 2 === 0">
                {{ i % 2 === 0 ? 'Published' : 'Draft' }}
              </span>
            </div>
          </div>
          <div class="map-actions">
            <button class="icon-button">✏️</button>
            <button class="icon-button">🗑️</button>
            <button class="icon-button">👁️</button>
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
      .maps-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .action-button {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .action-button:hover {
        background: #2980b9;
      }
      .maps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      .map-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .map-preview {
        height: 200px;
        background: #f5f5f5;
      }
      .map-info {
        padding: 1rem;
      }
      .map-info h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }
      .map-info p {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
      }
      .map-status {
        margin-top: 0.5rem;
      }
      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        background: #f5f5f5;
        color: #666;
      }
      .status-badge.published {
        background: #d4edda;
        color: #155724;
      }
      .map-actions {
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
        border-top: 1px solid #eee;
      }
      .icon-button {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background 0.2s;
      }
      .icon-button:hover {
        background: #f5f5f5;
      }
    `,
  ],
})
export class MapsComponent {
  today = new Date();
}
