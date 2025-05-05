import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="preview-container"
      [class.dark-mode]="themeService.isDarkMode()"
    >
      <div class="preview-content">
        <div class="map-container">
          <!-- Map will be rendered here -->
          <div *ngIf="!hasPreview" class="no-preview">
            <span class="material-icon">map</span>
            <p>GeoJSON preview will appear here</p>
          </div>
        </div>
      </div>
      <div class="preview-controls">
        <div class="control-group">
          <label>View Mode</label>
          <select [(ngModel)]="viewMode">
            <option value="map">Map View</option>
            <option value="json">JSON View</option>
          </select>
        </div>
        <div class="control-group">
          <label>
            <input type="checkbox" [(ngModel)]="showOriginalImage" />
            Show Original Image
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .preview-container {
        height: 100%;
        background: var(--bg-color, #ffffff);
        color: var(--text-color, #2c3e50);
        transition: all 0.3s ease;
      }

      .preview-container.dark-mode {
        --bg-color: #1a1f2e;
        --text-color: #ecf0f1;
        --surface-color: #2c3e50;
        --border-color: rgba(255, 255, 255, 0.1);
        --input-bg: #34495e;
      }

      .preview-content {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
      }

      .map-container {
        width: 100%;
        height: 300px;
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 4px;
        overflow: hidden;
        position: relative;
      }

      .no-preview {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: var(--text-color, #666);
      }

      .no-preview .material-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .preview-controls {
        padding: 1rem;
      }

      .control-group {
        margin-bottom: 1rem;
      }

      .control-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color, #2c3e50);
      }

      .control-group select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 4px;
        background: var(--input-bg, #ffffff);
        color: var(--text-color, #2c3e50);
      }

      .control-group input[type='checkbox'] {
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class PreviewComponent implements OnInit {
  hasPreview = false;
  viewMode: 'map' | 'json' = 'map';
  showOriginalImage = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    // Component initialization logic
  }
}
