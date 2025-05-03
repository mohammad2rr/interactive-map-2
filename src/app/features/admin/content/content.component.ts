import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-container">
      <h1>Content Management</h1>
      <div class="content-actions">
        <button class="action-button">Create New Content</button>
        <button class="action-button">Manage Categories</button>
        <button class="action-button">Review Submissions</button>
      </div>

      <div class="content-list">
        <div class="content-item" *ngFor="let i of [1, 2, 3, 4, 5]">
          <div class="content-info">
            <h3>Content Item {{ i }}</h3>
            <p>Last updated: {{ today | date }}</p>
          </div>
          <div class="content-actions">
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
      .content-container {
        padding: 2rem;
      }
      .content-actions {
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
      .content-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .content-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .content-info h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }
      .content-info p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
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
export class ContentComponent {
  today = new Date();
}
