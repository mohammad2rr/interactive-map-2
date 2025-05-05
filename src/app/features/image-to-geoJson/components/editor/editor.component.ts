import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-container" [class.dark-mode]="themeService.isDarkMode()">
      <div class="image-section">
        <div class="image-container">
          <img *ngIf="imageUrl" [src]="imageUrl" alt="Image to edit" />
          <div *ngIf="!imageUrl" class="upload-placeholder">
            <span class="material-icon">cloud_upload</span>
            <p>No image uploaded</p>
          </div>
        </div>
      </div>
      <div class="controls-section">
        <div class="control-group">
          <label>Threshold</label>
          <input type="range" min="0" max="255" [(ngModel)]="threshold" />
          <span class="value">{{ threshold }}</span>
        </div>
        <div class="control-group">
          <label>Color</label>
          <input type="color" [(ngModel)]="traceColor" />
        </div>
        <div class="control-group">
          <label>Detail Level</label>
          <select [(ngModel)]="detailLevel">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .editor-container {
        height: 100%;
        background: var(--bg-color, #ffffff);
        color: var(--text-color, #2c3e50);
        transition: all 0.3s ease;
      }

      .editor-container.dark-mode {
        --bg-color: #1a1f2e;
        --text-color: #ecf0f1;
        --surface-color: #2c3e50;
        --border-color: rgba(255, 255, 255, 0.1);
        --input-bg: #34495e;
      }

      .image-section {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
      }

      .image-container {
        width: 100%;
        height: 300px;
        border: 2px dashed var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .image-container img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .upload-placeholder {
        text-align: center;
        color: var(--text-color, #666);
      }

      .upload-placeholder .material-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .controls-section {
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

      .control-group input[type='range'] {
        width: 100%;
        margin-right: 1rem;
      }

      .control-group input[type='color'] {
        width: 50px;
        height: 30px;
        padding: 0;
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 4px;
      }

      .control-group select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 4px;
        background: var(--input-bg, #ffffff);
        color: var(--text-color, #2c3e50);
      }

      .value {
        color: var(--text-color, #666);
      }
    `,
  ],
})
export class EditorComponent {
  imageUrl: string | null = null;
  threshold: number = 128;
  traceColor: string = '#000000';
  detailLevel: 'low' | 'medium' | 'high' = 'medium';

  constructor(public themeService: ThemeService) {}
}
