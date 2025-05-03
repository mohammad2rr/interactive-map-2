import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="maps-container">
      <div class="maps-header">
        <h1>My Maps</h1>
        <button class="create-btn">
          <i>➕</i>
          <span>Create New Map</span>
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <input type="text" placeholder="Search maps..." />
          <i>🔍</i>
        </div>
        <div class="filter-options">
          <select>
            <option value="">All Maps</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>
          <select>
            <option value="">Sort by</option>
            <option value="recent">Most Recent</option>
            <option value="name">Name</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      <div class="maps-grid">
        <div class="map-card">
          <div class="map-preview">
            <img src="assets/images/map-preview-1.png" alt="Map Preview" />
            <div class="map-actions">
              <button class="action-btn" title="Edit">
                <i>✏️</i>
              </button>
              <button class="action-btn" title="Share">
                <i>🔗</i>
              </button>
              <button class="action-btn" title="Delete">
                <i>🗑️</i>
              </button>
            </div>
          </div>
          <div class="map-info">
            <h3>World Population</h3>
            <p>Last modified: 2 hours ago</p>
            <div class="map-tags">
              <span class="tag">Public</span>
              <span class="tag">Population</span>
            </div>
          </div>
        </div>

        <div class="map-card">
          <div class="map-preview">
            <img src="assets/images/map-preview-2.png" alt="Map Preview" />
            <div class="map-actions">
              <button class="action-btn" title="Edit">
                <i>✏️</i>
              </button>
              <button class="action-btn" title="Share">
                <i>🔗</i>
              </button>
              <button class="action-btn" title="Delete">
                <i>🗑️</i>
              </button>
            </div>
          </div>
          <div class="map-info">
            <h3>Climate Change</h3>
            <p>Last modified: 1 day ago</p>
            <div class="map-tags">
              <span class="tag">Private</span>
              <span class="tag">Environment</span>
            </div>
          </div>
        </div>

        <div class="map-card">
          <div class="map-preview">
            <img src="assets/images/map-preview-3.png" alt="Map Preview" />
            <div class="map-actions">
              <button class="action-btn" title="Edit">
                <i>✏️</i>
              </button>
              <button class="action-btn" title="Share">
                <i>🔗</i>
              </button>
              <button class="action-btn" title="Delete">
                <i>🗑️</i>
              </button>
            </div>
          </div>
          <div class="map-info">
            <h3>Economic Growth</h3>
            <p>Last modified: 3 days ago</p>
            <div class="map-tags">
              <span class="tag">Shared</span>
              <span class="tag">Economy</span>
            </div>
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

      .maps-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      h1 {
        color: #2c3e50;
        margin: 0;
      }

      .create-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .create-btn:hover {
        background: #2980b9;
      }

      .filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        gap: 1rem;
      }

      .search-box {
        position: relative;
        flex: 1;
      }

      .search-box input {
        width: 100%;
        padding: 0.75rem 2.5rem 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
      }

      .search-box i {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
      }

      .filter-options {
        display: flex;
        gap: 1rem;
      }

      .filter-options select {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        color: #2c3e50;
        cursor: pointer;
      }

      .maps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .map-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.2s;
      }

      .map-card:hover {
        transform: translateY(-2px);
      }

      .map-preview {
        position: relative;
        height: 200px;
        overflow: hidden;
      }

      .map-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .map-actions {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: flex;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .map-card:hover .map-actions {
        opacity: 1;
      }

      .action-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
      }

      .action-btn:hover {
        background: white;
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

      .map-tags {
        display: flex;
        gap: 0.5rem;
      }

      .tag {
        padding: 0.25rem 0.5rem;
        background: #f5f5f5;
        border-radius: 4px;
        font-size: 0.8rem;
        color: #666;
      }

      @media (max-width: 768px) {
        .maps-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .filters {
          flex-direction: column;
          align-items: stretch;
        }

        .filter-options {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class MapsComponent {}
